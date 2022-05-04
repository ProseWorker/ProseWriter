import { HomeIcon } from "outline-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Optional } from "utility-types";
import CollectionIcon from "~/components/CollectionIcon";
import Flex from "~/components/Flex";
import InputSelect from "~/components/InputSelect";
import { IconWrapper } from "~/components/Sidebar/components/SidebarLink";
import useStores from "~/hooks/useStores";
import useToasts from "~/hooks/useToasts";

type DefaultCollectionInputSelectProps = Optional<
  React.ComponentProps<typeof InputSelect>
> & {
  onSelectCollection: (collection: string) => void;
  defaultCollectionId: string | null;
};

const DefaultCollectionInputSelect = ({
  onSelectCollection,
  defaultCollectionId,
  ...rest
}: DefaultCollectionInputSelectProps) => {
  const { t } = useTranslation();
  const { collections } = useStores();
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState();
  const { showToast } = useToasts();

  React.useEffect(() => {
    async function load() {
      if (!collections.isLoaded && !fetching && !fetchError) {
        try {
          setFetching(true);
          await collections.fetchPage({
            limit: 100,
          });
        } catch (error) {
          showToast(
            t("Collections could not be loaded, please reload the app"),
            {
              type: "error",
            }
          );
          setFetchError(error);
        } finally {
          setFetching(false);
        }
      }
    }
    load();
  }, [showToast, fetchError, t, fetching, collections]);

  const options = React.useMemo(
    () =>
      collections.publicCollections.reduce(
        (acc, collection) => [
          ...acc,
          {
            label: (
              <Flex align="center">
                <IconWrapper>
                  <CollectionIcon collection={collection} />
                </IconWrapper>
                {collection.name}
              </Flex>
            ),
            value: collection.id,
          },
        ],
        [
          {
            label: (
              <Flex align="center">
                <IconWrapper>
                  <HomeIcon color="currentColor" />
                </IconWrapper>
                {t("Home")}
              </Flex>
            ),
            value: "home",
          },
        ]
      ),
    [collections.publicCollections, t]
  );

  if (fetching) {
    return null;
  }

  return (
    <InputSelect
      value={defaultCollectionId ?? "home"}
      options={options}
      onChange={onSelectCollection}
      ariaLabel={t("Default collection")}
      short
      {...rest}
    />
  );
};

export default DefaultCollectionInputSelect;
