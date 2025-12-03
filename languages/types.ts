
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface TranslationDictionary {
  header: {
    title: string;
    subtitle: string;
    docs: string;
  };
  tabs: {
    create: string;
    transform: string;
  };
  hero: {
    title: string;
    subtitle: string;
    titleTransform: string;
    subtitleTransform: string;
  };
  inputs: {
    sourceSvgLabel: string;
    sourceSvgPlaceholder: string;
    objectLabel: string;
    objectPlaceholder: string; // For create
    transformLabel: string; // For transform
    transformPlaceholder: string;
    styleLabel: string;
    stylePlaceholder: string;
    techLabel: string;
    techPlaceholder: string;
    resolutionLabel: string;
    customRes: string;
    urlsLabel: string;
    urlsPlaceholder: string;
    intelligenceLabel: string;
    searchLabel: string;
    dropzoneDefault: string;
    dropzoneDragging: string;
    pasteLabel: string;
    addOptions: string;
    hideOptions: string;
    generateButton: string;
    transformButton: string;
    generatingButton: string;
  };
  preview: {
    resultTitle: string;
    copyTooltip: string;
    downloadButton: string;
    downloadSvg: string;
    downloadPng: string;
    downloadZip: string;
    generatedBy: string;
    emptyStateTitle: string;
    emptyStateDesc: string;
    emptyStateDescShort: string;
    bgDark: string;
    bgLight: string;
    bgGrid: string;
  };
  history: {
    title: string;
    empty: string;
    restore: string;
    delete: string;
    clearAll: string;
  };
  refine: {
    label: string;
    placeholder: string;
    button: string;
    processing: string;
  };
  errors: {
    generationFailed: string;
    defaultDetails: string;
  };
  suggestions: {
    camera: string;
    rocket: string;
    bird: string;
    house: string;
  }
}
