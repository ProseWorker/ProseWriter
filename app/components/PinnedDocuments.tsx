import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import fractionalIndex from "fractional-index";
import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import breakpoint from "styled-components-breakpoint";
import Pin from "~/models/Pin";
import DocumentCard from "~/components/DocumentCard";
import useStores from "~/hooks/useStores";

type Props = {
  /** Pins to display */
  pins: Pin[];
  /** Maximum number of pins to display */
  limit?: number;
  /** Whether the user has permission to update pins */
  canUpdate?: boolean;
};

function PinnedDocuments({ limit, pins, canUpdate, ...rest }: Props) {
  const { documents, collections } = useStores();
  const [items, setItems] = React.useState(pins.map((pin) => pin.documentId));

  React.useEffect(() => {
    setItems(pins.map((pin) => pin.documentId));
  }, [pins]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        setItems((items) => {
          const activePos = items.indexOf(active.id);
          const overPos = items.indexOf(over.id);

          const overIndex = pins[overPos]?.index || null;
          const nextIndex = pins[overPos + 1]?.index || null;
          const prevIndex = pins[overPos - 1]?.index || null;
          const pin = pins[activePos];

          // Update the order on the backend, revert if the call fails
          pin
            .save({
              index:
                overPos === 0
                  ? fractionalIndex(null, overIndex)
                  : activePos > overPos
                  ? fractionalIndex(prevIndex, overIndex)
                  : fractionalIndex(overIndex, nextIndex),
            })
            .catch(() => setItems(items));

          // Update the order in state immediately
          return arrayMove(items, activePos, overPos);
        });
      }
    },
    [pins]
  );

  if (collections.orderedData.length === 0) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToParentElement]}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <List>
          <AnimatePresence initial={false}>
            {items.map((documentId) => {
              const document = documents.get(documentId);
              const pin = pins.find((pin) => pin.documentId === documentId);

              return document ? (
                <DocumentCard
                  key={documentId}
                  document={document}
                  canUpdatePin={canUpdate}
                  isDraggable={items.length > 1}
                  pin={pin}
                  {...rest}
                />
              ) : null;
            })}
          </AnimatePresence>
        </List>
      </SortableContext>
    </DndContext>
  );
}

const List = styled.div`
  display: grid;
  column-gap: 8px;
  row-gap: 8px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  padding: 0;
  list-style: none;
  margin: 16px 0 32px;

  &:empty {
    display: none;
  }

  ${breakpoint("tablet")`
    grid-template-columns: repeat(3, minmax(0, 1fr));
  `};

  ${breakpoint("desktop")`
    grid-template-columns: repeat(4, minmax(0, 1fr));
  `};
`;

export default observer(PinnedDocuments);
