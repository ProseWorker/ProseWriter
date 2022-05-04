import {
  BookmarkedIcon,
  BicycleIcon,
  CollectionIcon,
  CoinsIcon,
  AcademicCapIcon,
  BeakerIcon,
  BuildingBlocksIcon,
  CameraIcon,
  CloudIcon,
  CodeIcon,
  EditIcon,
  EmailIcon,
  EyeIcon,
  GlobeIcon,
  InfoIcon,
  ImageIcon,
  LeafIcon,
  LightBulbIcon,
  MathIcon,
  MoonIcon,
  NotepadIcon,
  PadlockIcon,
  PaletteIcon,
  PromoteIcon,
  QuestionMarkIcon,
  SportIcon,
  SunIcon,
  TargetIcon,
  TerminalIcon,
  ToolsIcon,
  VehicleIcon,
  WarningIcon,
  DatabaseIcon,
  SmileyIcon,
  LightningIcon,
} from "outline-icons";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useMenuState, MenuButton, MenuItem } from "reakit/Menu";
import styled, { useTheme } from "styled-components";
import breakpoint from "styled-components-breakpoint";
import ContextMenu from "~/components/ContextMenu";
import Flex from "~/components/Flex";
import { LabelText } from "~/components/Input";
import NudeButton from "~/components/NudeButton";
import Text from "~/components/Text";

const style = {
  width: 30,
  height: 30,
};
const TwitterPicker = React.lazy(
  () =>
    import(
      /* webpackChunkName: "twitter-picker" */
      "react-color/lib/components/twitter/Twitter"
    )
);

export const icons = {
  academicCap: {
    component: AcademicCapIcon,
    keywords: "learn teach lesson guide tutorial onboarding training",
  },
  bicycle: {
    component: BicycleIcon,
    keywords: "bicycle bike cycle",
  },
  beaker: {
    component: BeakerIcon,
    keywords: "lab research experiment test",
  },
  buildingBlocks: {
    component: BuildingBlocksIcon,
    keywords: "app blocks product prototype",
  },
  bookmark: {
    component: BookmarkedIcon,
    keywords: "bookmark",
  },
  collection: {
    component: CollectionIcon,
    keywords: "collection",
  },
  coins: {
    component: CoinsIcon,
    keywords: "coins money finance sales income revenue cash",
  },
  camera: {
    component: CameraIcon,
    keywords: "photo picture",
  },
  cloud: {
    component: CloudIcon,
    keywords: "cloud service aws infrastructure",
  },
  code: {
    component: CodeIcon,
    keywords: "developer api code development engineering programming",
  },
  database: {
    component: DatabaseIcon,
    keywords: "server ops database",
  },
  email: {
    component: EmailIcon,
    keywords: "email at",
  },
  eye: {
    component: EyeIcon,
    keywords: "eye view",
  },
  globe: {
    component: GlobeIcon,
    keywords: "world translate",
  },
  info: {
    component: InfoIcon,
    keywords: "info information",
  },
  image: {
    component: ImageIcon,
    keywords: "image photo picture",
  },
  leaf: {
    component: LeafIcon,
    keywords: "leaf plant outdoors nature ecosystem climate",
  },
  lightbulb: {
    component: LightBulbIcon,
    keywords: "lightbulb idea",
  },
  lightning: {
    component: LightningIcon,
    keywords: "lightning fast zap",
  },
  math: {
    component: MathIcon,
    keywords: "math formula",
  },
  moon: {
    component: MoonIcon,
    keywords: "night moon dark",
  },
  notepad: {
    component: NotepadIcon,
    keywords: "journal notepad write notes",
  },
  padlock: {
    component: PadlockIcon,
    keywords: "padlock private security authentication authorization auth",
  },
  palette: {
    component: PaletteIcon,
    keywords: "design palette art brand",
  },
  pencil: {
    component: EditIcon,
    keywords: "copy writing post blog",
  },
  promote: {
    component: PromoteIcon,
    keywords: "marketing promotion",
  },
  question: {
    component: QuestionMarkIcon,
    keywords: "question help support faq",
  },
  sun: {
    component: SunIcon,
    keywords: "day sun weather",
  },
  sport: {
    component: SportIcon,
    keywords: "sport outdoor racket game",
  },
  smiley: {
    component: SmileyIcon,
    keywords: "emoji smiley happy",
  },
  target: {
    component: TargetIcon,
    keywords: "target goal sales",
  },
  terminal: {
    component: TerminalIcon,
    keywords: "terminal code",
  },
  tools: {
    component: ToolsIcon,
    keywords: "tool settings",
  },
  vehicle: {
    component: VehicleIcon,
    keywords: "truck car travel transport",
  },
  warning: {
    component: WarningIcon,
    keywords: "warning alert error",
  },
};
const colors = [
  "#4E5C6E",
  "#0366d6",
  "#9E5CF7",
  "#FF825C",
  "#FF5C80",
  "#FFBE0B",
  "#42DED1",
  "#00D084",
  "#FF4DFA",
  "#2F362F",
];
type Props = {
  onOpen?: () => void;
  onClose?: () => void;
  onChange: (color: string, icon: string) => void;
  icon: string;
  color: string;
};

function IconPicker({ onOpen, onClose, icon, color, onChange }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const menu = useMenuState({
    modal: true,
    placement: "bottom-end",
  });

  return (
    <Wrapper>
      <Label>
        <LabelText>{t("Icon")}</LabelText>
      </Label>
      <MenuButton {...menu}>
        {(props) => (
          <Button aria-label={t("Show menu")} {...props}>
            <Icon
              as={icons[icon || "collection"].component}
              color={color}
              size={30}
            />
          </Button>
        )}
      </MenuButton>
      <ContextMenu
        {...menu}
        onOpen={onOpen}
        onClose={onClose}
        aria-label={t("Choose icon")}
      >
        <Icons>
          {Object.keys(icons).map((name) => {
            return (
              <MenuItem
                key={name}
                onClick={() => onChange(color, name)}
                {...menu}
              >
                {(props) => (
                  <IconButton style={style} {...props}>
                    <Icon as={icons[name].component} color={color} size={30} />
                  </IconButton>
                )}
              </MenuItem>
            );
          })}
        </Icons>
        <Flex>
          <React.Suspense fallback={<Loading>{t("Loading")}…</Loading>}>
            <ColorPicker
              color={color}
              onChange={(color) => onChange(color.hex, icon)}
              colors={colors}
              triangle="hide"
              styles={{
                default: {
                  hash: {
                    color: theme.text,
                    background: theme.inputBorder,
                  },
                  input: {
                    color: theme.text,
                    boxShadow: `inset 0 0 0 1px ${theme.inputBorder}`,
                    background: "transparent",
                  },
                },
              }}
            />
          </React.Suspense>
        </Flex>
      </ContextMenu>
    </Wrapper>
  );
}

const Icon = styled.svg`
  transition: fill 150ms ease-in-out;
`;

const Label = styled.label`
  display: block;
`;

const Icons = styled.div`
  padding: 16px 8px 0 16px;

  ${breakpoint("tablet")`
    width: 276px;
  `};
`;

const Button = styled(NudeButton)`
  border: 1px solid ${(props) => props.theme.inputBorder};
  width: 32px;
  height: 32px;
`;

const IconButton = styled(NudeButton)`
  border-radius: 4px;
  margin: 0px 6px 6px 0px;
  width: 30px;
  height: 30px;
`;

const Loading = styled(Text)`
  padding: 16px;
`;

const ColorPicker = styled(TwitterPicker)`
  box-shadow: none !important;
  background: transparent !important;
  width: auto !important;

  ${breakpoint("tablet")`
    width: 276px;
  `};
`;

const Wrapper = styled("div")`
  display: inline-block;
  position: relative;
`;

export default IconPicker;
