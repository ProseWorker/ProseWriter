import * as React from "react";
import Frame from "../components/Frame";
import { EmbedProps as Props } from ".";

const URL_REGEX = /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([a-zA-Z0-9_-]{11})$/i;

export default class YouTube extends React.Component<Props> {
  static ENABLED = [URL_REGEX];

  render() {
    const { matches } = this.props.attrs;
    const videoId = matches[1];
    return (
      <Frame
        {...this.props}
        src={`https://www.youtube.com/embed/${videoId}?modestbranding=1`}
        title={`YouTube (${videoId})`}
      />
    );
  }
}
