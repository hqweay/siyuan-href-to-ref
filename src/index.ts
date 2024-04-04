import { Plugin, showMessage, confirm, fetchSyncPost } from "siyuan";

export default class PluginSample extends Plugin {
  private blockIconEventBindThis = this.blockIconEvent.bind(this);

  availableBlocks = ["NodeParagraph", "NodeHeading"];

  private blockIconEvent({ detail }: any) {
    detail.menu.addItem({
      iconHTML: "",
      // label: this.i18n.removeSpace,
      label: this.i18n.addTopBarIcon,
      click: () => {
        const doOperations: IOperation[] = [];

        detail.blockElements.forEach((item: HTMLElement) => {
          const editElements = item.querySelectorAll(
            this.availableBlocks
              .map((item) => {
                return `[data-type=${item}] [contenteditable="true"]`;
              })
              .join(",")
          );

          editElements.forEach((editElement: HTMLElement) => {
            //data-type 从 block-ref 转为 a
            editElement
              // data-type~="block-ref" 模糊匹配
              .querySelectorAll("[data-type=block-ref]")
              .forEach((ele) => {
                ele.setAttribute("data-type", "a");
                ele.removeAttribute("data-subtype");
                ele.setAttribute(
                  "data-href",
                  `siyuan://blocks/${ele.getAttribute("data-id")}`
                );
                ele.removeAttribute("data-id");
              });
          });
          doOperations.push({
            id: item.dataset.nodeId,
            data: item.outerHTML,
            action: "update",
          });
        });
        detail.protyle.getInstance().transaction(doOperations);
      },
    });
  }
  onload() {
    this.eventBus.on("click-blockicon", this.blockIconEventBindThis);
  }
}
