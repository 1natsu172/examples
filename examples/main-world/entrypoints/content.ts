import { waitElement } from "@1natsu/wait-element";

export default defineContentScript({
  matches: ["*://*.youtube.com/*"],
  world: "MAIN",
  async main() {
    console.log("Hello main world.");

    const player = await waitElement("#movie_player");

    console.log(player.getCurrentTime());
  },
});
