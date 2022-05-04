import * as React from "react";
import Frame from "../components/Frame";
import { EmbedProps as Props } from ".";

const URL_REGEX = /^https:\/\/trello.com\/(c|b)\/([^/]*)(.*)?$/;

export default class Trello extends React.Component<Props> {
  static ENABLED = [URL_REGEX];

  render() {
    const { matches } = this.props.attrs;
    const objectId = matches[2];

    if (matches[1] === "c") {
      return (
        <Frame
          width="316px"
          height="158px"
          src={`https://trello.com/embed/card?id=${objectId}`}
          title={`Trello Card (${objectId})`}
        />
      );
    }

    return (
      <Frame
        {...this.props}
        width="248px"
        height="185px"
        src={`https://trello.com/embed/board?id=${objectId}`}
        title={`Trello Board (${objectId})`}
      />
    );
  }
}
