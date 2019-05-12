import Instagram from "../lib/instagram";
import LikeFirstPost from "./likeFirstPost";
import Wait from "./wait";
import LikesRange from "./likesRange";
import Follow from "./follow";

export interface ActionInterface {
  run: (user, client: Instagram) => void;
}

export default function buildActions ([ code, params ]): ActionInterface {

  switch (code) {
    case "likeFirstPost":
      return new LikeFirstPost(params);
    case "wait":
      return new Wait(params);
    case "likesRange":
      return new LikesRange(params);
    case "follow":
      return new Follow(params);
    default:
      throw new Error('Передан неизветный тип действия');
  }
}
