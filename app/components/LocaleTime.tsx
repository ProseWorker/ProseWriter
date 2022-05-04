import { format as formatDate, formatDistanceToNow } from "date-fns";
import * as React from "react";
import Tooltip from "~/components/Tooltip";
import useUserLocale from "~/hooks/useUserLocale";
import { dateLocale } from "~/utils/i18n";

let callbacks: (() => void)[] = [];

// This is a shared timer that fires every minute, used for
// updating all Time components across the page all at once.
setInterval(() => {
  callbacks.forEach((cb) => cb());
}, 1000 * 60);

function eachMinute(fn: () => void) {
  callbacks.push(fn);

  return () => {
    callbacks = callbacks.filter((cb) => cb !== fn);
  };
}

type Props = {
  dateTime: string;
  tooltipDelay?: number;
  addSuffix?: boolean;
  shorten?: boolean;
  relative?: boolean;
  format?: string;
};

const LocaleTime: React.FC<Props> = ({
  addSuffix,
  children,
  dateTime,
  shorten,
  format,
  relative,
  tooltipDelay,
}) => {
  const userLocale = useUserLocale();
  const [_, setMinutesMounted] = React.useState(0); // eslint-disable-line @typescript-eslint/no-unused-vars
  const callback = React.useRef<() => void>();

  React.useEffect(() => {
    callback.current = eachMinute(() => {
      setMinutesMounted((state) => ++state);
    });
    return () => {
      if (callback.current) {
        callback.current?.();
      }
    };
  }, []);

  const locale = dateLocale(userLocale);
  let relativeContent = formatDistanceToNow(Date.parse(dateTime), {
    addSuffix,
    locale,
  });

  if (shorten) {
    relativeContent = relativeContent
      .replace("about", "")
      .replace("less than a minute ago", "just now")
      .replace("minute", "min");
  }

  const tooltipContent = formatDate(
    Date.parse(dateTime),
    "MMMM do, yyyy h:mm a",
    {
      locale,
    }
  );
  const content =
    relative !== false
      ? relativeContent
      : formatDate(Date.parse(dateTime), format || "MMMM do, yyyy h:mm a", {
          locale,
        });

  return (
    <Tooltip tooltip={tooltipContent} delay={tooltipDelay} placement="bottom">
      <time dateTime={dateTime}>{children || content}</time>
    </Tooltip>
  );
};

export default LocaleTime;
