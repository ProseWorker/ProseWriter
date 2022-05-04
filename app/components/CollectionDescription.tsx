import debounce from "lodash/debounce";
import { observer } from "mobx-react";
import { transparentize } from "polished";
import * as React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Collection from "~/models/Collection";
import Arrow from "~/components/Arrow";
import ButtonLink from "~/components/ButtonLink";
import Editor from "~/components/Editor";
import LoadingIndicator from "~/components/LoadingIndicator";
import NudeButton from "~/components/NudeButton";
import usePolicy from "~/hooks/usePolicy";
import useStores from "~/hooks/useStores";
import useToasts from "~/hooks/useToasts";

type Props = {
  collection: Collection;
};

function CollectionDescription({ collection }: Props) {
  const { collections } = useStores();
  const { showToast } = useToasts();
  const { t } = useTranslation();
  const [isExpanded, setExpanded] = React.useState(false);
  const [isEditing, setEditing] = React.useState(false);
  const [isDirty, setDirty] = React.useState(false);
  const can = usePolicy(collection.id);

  const handleStartEditing = React.useCallback(() => {
    setEditing(true);
  }, []);

  const handleStopEditing = React.useCallback(() => {
    setEditing(false);
  }, []);

  const handleClickDisclosure = React.useCallback(
    (event) => {
      event.preventDefault();

      if (isExpanded && document.activeElement) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'blur' does not exist on type 'Element'.
        document.activeElement.blur();
      }

      setExpanded(!isExpanded);
    },
    [isExpanded]
  );

  const handleSave = React.useMemo(
    () =>
      debounce(async (getValue) => {
        try {
          await collection.save({
            description: getValue(),
          });
          setDirty(false);
        } catch (err) {
          showToast(
            t("Sorry, an error occurred saving the collection", {
              type: "error",
            })
          );
          throw err;
        }
      }, 1000),
    [collection, showToast, t]
  );

  const handleChange = React.useCallback(
    (getValue) => {
      setDirty(true);
      handleSave(getValue);
    },
    [handleSave]
  );

  React.useEffect(() => {
    setEditing(false);
  }, [collection.id]);
  const placeholder = `${t("Add a description")}…`;
  const key = isEditing || isDirty ? "draft" : collection.updatedAt;

  return (
    <MaxHeight data-editing={isEditing} data-expanded={isExpanded}>
      <Input data-editing={isEditing} data-expanded={isExpanded}>
        <span onClick={can.update ? handleStartEditing : undefined}>
          {collections.isSaving && <LoadingIndicator />}
          {collection.hasDescription || isEditing || isDirty ? (
            <React.Suspense
              fallback={
                <Placeholder
                  onClick={() => {
                    //
                  }}
                >
                  Loading…
                </Placeholder>
              }
            >
              <Editor
                key={key}
                defaultValue={collection.description || ""}
                onChange={handleChange}
                placeholder={placeholder}
                readOnly={!isEditing}
                autoFocus={isEditing}
                onBlur={handleStopEditing}
                maxLength={1000}
                embedsDisabled
                readOnlyWriteCheckboxes
              />
            </React.Suspense>
          ) : (
            can.update && (
              <Placeholder
                onClick={() => {
                  //
                }}
              >
                {placeholder}
              </Placeholder>
            )
          )}
        </span>
      </Input>
      {!isEditing && (
        <Disclosure
          onClick={handleClickDisclosure}
          aria-label={isExpanded ? t("Collapse") : t("Expand")}
          size={30}
        >
          <Arrow />
        </Disclosure>
      )}
    </MaxHeight>
  );
}

const Disclosure = styled(NudeButton)`
  opacity: 0;
  color: ${(props) => props.theme.divider};
  position: absolute;
  top: calc(25vh - 50px);
  left: 50%;
  z-index: 1;
  transform: rotate(-90deg) translateX(-50%);
  transition: opacity 100ms ease-in-out;

  &:focus,
  &:hover {
    opacity: 1;
  }

  &:active {
    color: ${(props) => props.theme.sidebarText};
  }
`;

const Placeholder = styled(ButtonLink)`
  color: ${(props) => props.theme.placeholder};
  cursor: text;
  min-height: 27px;
`;

const MaxHeight = styled.div`
  position: relative;
  max-height: 25vh;
  overflow: hidden;
  margin: -12px -8px -8px;
  padding: 8px;

  &[data-editing="true"],
  &[data-expanded="true"] {
    max-height: initial;
    overflow: initial;

    ${Disclosure} {
      top: initial;
      bottom: 0;
      transform: rotate(90deg) translateX(-50%);
    }
  }

  &:hover ${Disclosure} {
    opacity: 1;
  }
`;

const Input = styled.div`
  margin: -8px;
  padding: 8px;
  border-radius: 8px;
  transition: ${(props) => props.theme.backgroundTransition};

  &:after {
    content: "";
    position: absolute;
    top: calc(25vh - 50px);
    left: 0;
    right: 0;
    height: 50px;
    pointer-events: none;
    background: linear-gradient(
      180deg,
      ${(props) => transparentize(1, props.theme.background)} 0%,
      ${(props) => props.theme.background} 100%
    );
  }

  &[data-editing="true"],
  &[data-expanded="true"] {
    &:after {
      background: transparent;
    }
  }

  &[data-editing="true"] {
    background: ${(props) => props.theme.secondaryBackground};
  }

  .block-menu-trigger,
  .heading-anchor {
    display: none !important;
  }
`;

export default observer(CollectionDescription);
