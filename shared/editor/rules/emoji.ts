import nameToEmoji from "gemoji/name-to-emoji.json";
import MarkdownIt from "markdown-it";
import emojiPlugin from "markdown-it-emoji";

export default function emoji(md: MarkdownIt) {
  // Ideally this would be an empty object, but due to a bug in markdown-it-emoji
  // passing an empty object results in newlines becoming emojis. Until this is
  // fixed at least one key is required. See:
  // https://github.com/markdown-it/markdown-it-emoji/issues/46
  const noMapping = {
    no_name_mapping: "💯",
  };

  return emojiPlugin(md, {
    defs: (md.options as any).emoji === false ? noMapping : nameToEmoji,
    shortcuts: {},
  });
}
