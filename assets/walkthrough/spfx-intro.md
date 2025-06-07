
# SharePoint Framework

With SharePoint Framework (SPFx), you can use modern web technologies and tools in your preferred development environment to build productive experiences and apps that are responsive and mobile-ready allowing you to create solutions to extend SharePoint, Microsoft Teams, Microsoft Viva Connections, Outlook and Microsoft365.com. This extensibility model allows you to write once and reuse your solutions in multiple Microsoft 365 applications with exactly the same code base.

The following are some of the key features included as part of the SPFx:

- It runs in the context of the current user and connection in the browser. There are no iFrames for the customization (JavaScript is embedded directly into the page).
- The controls are rendered in the normal page DOM.
- The controls are responsive and accessible by nature.
- It enables the developer to access the lifecycle in addition to render, load, serialize and deserialize, configuration changes, and more.
- It's framework-agnostic. You can use any JavaScript framework that you like including, but not limited to, React, Handlebars, Knockout, Angular, and Vue.js.
- The developer toolchain is based on popular open-source client development tools such as NPM, TypeScript, Yeoman, webpack, and gulp.
- Performance is reliable.
- End users can use SPFx client-side solutions that are approved by the tenant administrators (or their delegates) on all sites, including self-service team, group, or personal sites.
- SPFx web parts can be added to both classic and modern pages.
- SPFx solutions can be used to extend Microsoft Teams.
- SPFx can be used to extend Microsoft Viva Connections.
- SPFx can be used to extend Outlook and Office 365 app (Office)

With SharePoint Framework you may create client-side web parts, extensions, and adaptive cards.

- Web pats are controls that appear inside a SharePoint page and execute client-side in the browser. They're the building blocks of pages that appear on a SharePoint site. You can build client-side web parts using modern client-side development tools and the SharePoint workbench (a development test surface). You can deploy your client-side web parts to both modern pages and classic web part pages in Microsoft 365 tenants.
- Extensions allows you to extend the SharePoint user experience. With SPFx Extensions, you can customize more facets of the SharePoint experience, including notification areas, toolbars, list data views, and forms. SPFx Extensions are available in all Microsoft 365 subscriptions for production usage. SPFx Extensions enable you to extend the SharePoint user experience within modern pages and document libraries, while using the familiar SPFx tools and libraries for client-side development. Specifically, the SPFx includes four extension types:

    - Application Customizers: Adds scripts to the page, and accesses well-known HTML element placeholders and extends them with custom renderings.
    - Field Customizers: Provides modified views to data for fields within a list.
    - Command Sets: Extends the SharePoint command surfaces to add new actions, and provides client-side code that you can use to implement behaviors.
    - Form Customizer: Provides a way to assoicate and override default new, edit and view form experiences of list and libraries with custom forms by associating component to content type.

- Library components enables you to have independently versioned and deployed code served automatically for the SharePoint Framework components with a deployment through an app catalog. Library components provide you an alternative option to create shared code, which can be then used and referenced across all the components in the tenant.
- Adaptive Cards Extensions allow you to extend Viva Connections dashboard with your own custom functionalities and visualizations 

Go over the [overview of the SharePoint Framework](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/sharepoint-framework-overview) to find out more.

## Set up your Microsoft 365 tenant

To build and deploy client-side web parts, extensions or adaptive cards using the SharePoint Framework, you need a Microsoft 365 tenant. You may join the [developer program](https://developer.microsoft.com/en-us/microsoft-365/dev-program) to get a free Microsoft 365 developer tenant.

Go over the [set up instructions](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant) to find out more.