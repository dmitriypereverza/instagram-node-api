import Instagram from "../lib/instagram";
import LikeByIndex from "./likeByIndex";
import Wait from "./wait";
import LikesRange from "./likesRange";
import Follow from "./follow";
import WaitRange from "./waitRange";

export interface ActionInterface {
  run: (user, client: Instagram) => void;
}

export default function buildActions ([ code, params ]): ActionInterface {

  switch (code) {
    case "likeByIndex":
      return new LikeByIndex(params);
    case "wait":
      return new Wait(params);
    case "waitRange":
      return new WaitRange(params);
    case "likesRange":
      return new LikesRange(params);
    case "follow":
      return new Follow(params);
    default:
      throw new Error('Передан неизветный тип действия');
  }
}
