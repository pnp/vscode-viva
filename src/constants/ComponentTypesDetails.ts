type ComponentTypeDetailsType = {
  [key: string]: {
    description: string;
    [key: string]: any;
  };
};

export const ComponentTypesDetails: ComponentTypeDetailsType = {
  webpart: {
    description:
      "A reusable component for displaying content and functionality on SharePoint pages.",
  },
  extension: {
    description:
      "Custom scripts that enhance or modify the SharePoint or Teams UI.",
    ApplicationCustomizer: {
      description: "Customizes the appearance and behavior of pages.",
    },
    FieldCustomizer: {
      description: "Modifies the way fields are displayed in lists.",
    },
    ListViewCommandSet: {
      description: "Adds custom commands to list view toolbars.",
    },
    FormCustomizer: {
      description: "Customizes the look and feel of forms.",
    },
    SearchQueryModifier: {
      description: "Modifies search queries to enhance search results.",
    },
  },
  library: {
    description:
      "A collection of files and documents with collaboration and version control features.",
  },
  adaptiveCardExtension: {
    description:
      "Components that render adaptive cards in SharePoint or Teams for flexible and interactive content.",
    Generic: {
      description: "A flexible template that can be customized for various use cases, displaying general information and content in an adaptive card format.",
    },
    Search: {
      description: "A template designed to modify and enhance search queries, improving the relevance and accuracy of search results displayed in adaptive cards.",
    },
    DataVisualization: {
      description: "A template focused on presenting data visualizations, such as charts and graphs, within adaptive cards to provide clear and insightful data representations.",
    },
  },
  none: {
    description:
      "Use any library or write pure JavaScript for maximum flexibility.",
  },
  react: {
    description:
      "Popular library for building dynamic and responsive UI components.",
  },
  minimal: {
    description:
      "Lightweight setup with minimal dependencies for straightforward functionality.",
  },
};
