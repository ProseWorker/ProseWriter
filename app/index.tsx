import React from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import fullPackage from "@shared/editor/packages/full";
import { light } from "@shared/styles/theme";
import Flex from "~/components/Flex";
import { Editor } from "~/editor";
import useDictionary from "~/hooks/useDictionary";

function App() {
  const dictionary = useDictionary();
  const { t } = useTranslation();

  return (
    <Flex
      auto
      column
      style={{ padding: "40px", border: "4px solid #e8e8e8", borderRadius: "8px" }}
    >
      <Editor
        theme={light}
        // ref={ref}
        autoFocus={true}
        placeholder={t("Type '/' to insert, or start writing…")}
        scrollTo={window.location.hash}
        readOnly={false}
        // shareId={shareId}
        value={"# H1"}
        extensions={fullPackage}
        grow={true}
        onShowToast={(message) => {
          return message;
        }}
        onClickLink={() => {
          return null;
        }}
        onChange={(value) => {
          console.dir(value());
        }}
        embeds={[]}
        dictionary={dictionary}
      />
      {/*<Editor
        // ref={ref}
        autoFocus={true}
        placeholder={"Type '/' to insert, or start writing…"}
        scrollTo={window.location.hash}
        readOnly={true}
        shareId={""}
        extensions={fullPackage}
        grow
      />
      <LazyLoadedEditor
        defaultValue={""}
        onClickLink={() => null}
        placeholder={"fsdfds"}
        dictionary={dictionary}
        embeds={[]}
        onShowToast={() => false}
      />*/}
    </Flex>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
