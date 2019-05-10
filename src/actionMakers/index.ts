import DefaultActionMaker from "./defaultActionMaker";

export interface ActionMakerInterface {
  runActions: (user: any) => void
}

export interface ActionMakerConfig {
  items: any[],
  likes: {
    needLike: boolean,
    firstLike: boolean,
    count: number,
    range: number
  },
  follow: {
    needFollow: boolean
  },
  comment: {
    needComment: boolean
  }
}

export default function makeActionMaker(config: ActionMakerConfig) {
  return new DefaultActionMaker(config);
};
