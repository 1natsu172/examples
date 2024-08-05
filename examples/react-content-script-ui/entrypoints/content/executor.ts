import { ContentScriptContext } from "wxt/client";
import { Unwatch } from "wxt/storage";

export class Executor {
  constructor(private ctx: ContentScriptContext) {
    this.#definedFoo = storage.defineItem<{ count: number }>("local:foo", {
      fallback: { count: 0 },
    });

    /**
     * Cleanup when onInvalidated
     */
    this.ctx.onInvalidated(() => {
      console.log("invalidated");
      this.cleanup();
    });
  }

  #definedFoo;
  #unwatchFoo: Unwatch | null = null;

  async init() {
    console.log("count now", await this.#definedFoo.getValue());

    this.ctx.addEventListener(document.body, "click", async () => {
      console.log("body clicked");
      await this.update();
    });

    this.#unwatchFoo = this.#definedFoo.watch((newV, oldV) => {
      if (newV !== oldV) {
        console.log("count updated", newV.count);
      }
    });
  }

  public async update() {
    if (this.ctx.isInvalid) {
      return this.ctx.block();
    }

    const { count } = await this.#definedFoo.getValue();
    await this.#definedFoo.setValue({ count: count + 1 });
  }

  private cleanup() {
    console.log("try dispose");
    // Can not unwatch if already invalidated.
    this.#unwatchFoo?.();
    console.log("done cleanup");
  }
}
