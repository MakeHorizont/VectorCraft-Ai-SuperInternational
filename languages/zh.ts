
import { TranslationDictionary } from './types';

export const zh: TranslationDictionary = {
  header: {
    title: "VectorCraft AI",
    subtitle: "由 Gemini 3 Pro 提供支持",
    docs: "文档",
  },
  tabs: {
    create: "创世纪 (创建)",
    transform: "重构 (编辑)",
  },
  hero: {
    title: "你想创造什么？",
    subtitle: "描述一个物体，定义风格，我们将为你设计矢量艺术。",
    titleTransform: "优化与动画",
    subtitleTransform: "上传现有的 SVG 以升级其逻辑、风格或动态。",
  },
  inputs: {
    sourceSvgLabel: "源 SVG 代码 / 文件",
    sourceSvgPlaceholder: "在此粘贴 SVG 代码或上传文件...",
    objectLabel: "物体描述",
    objectPlaceholder: "例如：未来的头盔...",
    transformLabel: "改造目标",
    transformPlaceholder: "例如：颜色改为金色，加粗线条...",
    styleLabel: "视觉风格",
    stylePlaceholder: "例如：扁平化设计，霓虹色...",
    techLabel: "功能与动画规格",
    techPlaceholder: "例如：无限旋转齿轮，添加悬停发光效果...",
    resolutionLabel: "画布分辨率",
    customRes: "自定义",
    urlsLabel: "参考链接",
    urlsPlaceholder: "https://...",
    intelligenceLabel: "智能",
    searchLabel: "Google 搜索",
    dropzoneDefault: "拖入 SVG/图片，Ctrl+V",
    dropzoneDragging: "释放文件",
    pasteLabel: "粘贴",
    addOptions: "高级规格",
    hideOptions: "隐藏规格",
    generateButton: "生成",
    transformButton: "改造",
    generatingButton: "处理中...",
  },
  preview: {
    resultTitle: "结果",
    copyTooltip: "复制 SVG 代码",
    downloadButton: "导出",
    downloadSvg: "下载 SVG",
    downloadPng: "下载 PNG",
    downloadZip: "下载 ZIP (全部)",
    generatedBy: "由 Gemini 3 Pro 生成",
    emptyStateTitle: "等待输入",
    emptyStateDesc: "生成的作品将显示在这里",
    emptyStateDescShort: "艺术区"
  },
  refine: {
    label: "辩证扬弃 (Aufhebung)",
    placeholder: "需要解决什么矛盾？",
    button: "综合",
    processing: "扬弃中...",
  },
  errors: {
    generationFailed: "生成失败",
    defaultDetails: "联系 Gemini 时发生意外错误。",
  },
  suggestions: {
    camera: '复古相机',
    rocket: '太空火箭',
    bird: '折纸鸟',
    house: '等距房屋'
  }
};
