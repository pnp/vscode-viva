## Sign in to your tenant & retrieve environment details

The extension allows you to sign in to your Microsoft 365 tenant using CLI for Microsoft 365.

![login](../images/login.png)

SPFx Toolkit needs and Entra App Registration to be able to sign in to your tenant. You may either use an existing app registration or create a new one with a single click using a dedicated form. SPFx Toolkit will guide you through the process of creating a new app registration either manually by providing step-by-step guidance or automatically by creating the app registration for you.

![app registration](../images/sign-in.gif)

If you already have an Entra App Registration you may use it to sign in to your tenant by providing the Client Id and Tenant Id.

![app registration](../images/sign-in-existing-app.gif)

Thanks to that the extension will retrieve helpful URLs from your tenant like link to: 

- SharePoint main site 
- SharePoint admin site
- SharePoint web API permission management page

Additionally, the extension will check and retrieve tenant service health incidents that are currently happening in your tenant so that you gain quick insights on your tenant health.

![tenant details](../images/tenant-links.png)

After successful sign in an additional view is presented that shows list links to app catalogs available in the tenant, both tenant-level and all site-level app catalogs. Additionally it will show you all tenant-wide extensions installed on your tenant with.

![tenant details](../images/app-catalog-list.png)

Using the extension settings you may choose show or hide the tenant-wide extensions list and tenant health incidents list.

![settings](../images/settings.png)

Sign-in is also required for some actions to work properly like the deploy action which allows you to upload of the .sppkg file to the tenant or site-level App Catalog.

[Check out our docs for more details](https://github.com/pnp/vscode-viva/wiki/5.3-Login-to-your-tenant-&-retrieve-environment-details)