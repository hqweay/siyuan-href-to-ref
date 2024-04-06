import { Plugin, showMessage, confirm, fetchSyncPost } from "siyuan";

export default class PluginSample extends Plugin {
  private blockIconEventBindThis = this.blockIconEvent.bind(this);

  availableBlocks = ["NodeParagraph", "NodeHeading"];

  private blockIconEvent({ detail }: any) {
    detail.menu.addItem({
      iconHTML: "",
      label: this.i18n.menu,
      submenu: [
        {
          label: this.i18n.wikiToLink,
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
                    // 去除 subtype 属性是因为官方的 转换为链接 会这么做
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
        },
        {
          label: this.i18n.linkToWiki,
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
                //data-type 从 a 转为 block-ref
                editElement
                  // 只获取笔记内部的单向链接
                  .querySelectorAll('[data-type=a][data-href^="siyuan://"]')
                  .forEach((ele) => {
                    ele.setAttribute("data-type", "block-ref");
                    // 增加 subtype 属性是因为官方的 链接转引用 会这么添加一个属性：s
                    ele.setAttribute("data-subtype", `s`);
                    ele.setAttribute(
                      "data-id",
                      `${ele
                        .getAttribute("data-href")
                        .replace("siyuan://blocks/", "")}`
                    );
                    ele.removeAttribute("data-href");
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
        },
        {
          label: this.i18n.hrefToText,
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
                // 获取引用和笔记内单向超链接
                editElement
                  .querySelectorAll(
                    '[data-type="a"][data-href^="siyuan://"], [data-type="block-ref"]'
                  )
                  .forEach((ele) => {
                    var parentElement = ele.parentElement; // 获取父元素
                    parentElement.appendChild(ele.firstChild); // 将子元素移动到父元素内
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
        },
        {
          label: this.i18n.hrefToTextIncludeA,
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
                // 获取引用和笔记内链接
                // @todo data-type="a" 使用全匹配，避免 [data-type="a strong"] 这类情况转换后失去样式
                editElement
                  .querySelectorAll('[data-type="a"], [data-type="block-ref"]')
                  .forEach((ele) => {
                    var parentElement = ele.parentElement; // 获取父元素
                    parentElement.appendChild(ele.firstChild); // 将子元素移动到父元素内
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
        },
      ],
    });
  }

  onload() {
    this.eventBus.on("click-blockicon", this.blockIconEventBindThis);
  }
}
