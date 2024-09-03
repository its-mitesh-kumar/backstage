/*! For license information please see 6e922f3e.52176104.js.LICENSE.txt */
"use strict";(self.webpackChunkbackstage_microsite=self.webpackChunkbackstage_microsite||[]).push([[24819],{638495:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>a,contentTitle:()=>s,default:()=>p,frontMatter:()=>c,metadata:()=>i,toc:()=>d});var o=r(785893),t=r(511151);const c={id:"plugin-techdocs-backend.outoftheboxdeploymentoptions",title:"OutOfTheBoxDeploymentOptions",description:"API reference for OutOfTheBoxDeploymentOptions"},s=void 0,i={id:"reference/plugin-techdocs-backend.outoftheboxdeploymentoptions",title:"OutOfTheBoxDeploymentOptions",description:"API reference for OutOfTheBoxDeploymentOptions",source:"@site/../docs/reference/plugin-techdocs-backend.outoftheboxdeploymentoptions.md",sourceDirName:"reference",slug:"/reference/plugin-techdocs-backend.outoftheboxdeploymentoptions",permalink:"/docs/reference/plugin-techdocs-backend.outoftheboxdeploymentoptions",draft:!1,unlisted:!1,editUrl:"https://github.com/backstage/backstage/edit/master/docs/../docs/reference/plugin-techdocs-backend.outoftheboxdeploymentoptions.md",tags:[],version:"current",frontMatter:{id:"plugin-techdocs-backend.outoftheboxdeploymentoptions",title:"OutOfTheBoxDeploymentOptions",description:"API reference for OutOfTheBoxDeploymentOptions"}},a={},d=[];function l(e){const n={a:"a",code:"code",p:"p",pre:"pre",strong:"strong",...(0,t.a)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.a,{href:"/docs/reference/",children:"Home"})," > ",(0,o.jsx)(n.a,{href:"/docs/reference/plugin-techdocs-backend",children:(0,o.jsx)(n.code,{children:"@backstage/plugin-techdocs-backend"})})," > ",(0,o.jsx)(n.a,{href:"/docs/reference/plugin-techdocs-backend.outoftheboxdeploymentoptions",children:(0,o.jsx)(n.code,{children:"OutOfTheBoxDeploymentOptions"})})]}),"\n",(0,o.jsx)(n.p,{children:'Required dependencies for running TechDocs in the "out-of-the-box" deployment configuration (prepare/generate/publish all in the Backend).'}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.strong,{children:"Signature:"})}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-typescript",children:"export type OutOfTheBoxDeploymentOptions = {\n    preparers: PreparerBuilder;\n    generators: GeneratorBuilder;\n    publisher: PublisherBase;\n    logger: winston.Logger;\n    discovery: DiscoveryService;\n    database?: Knex;\n    config: Config;\n    cache: PluginCacheManager;\n    docsBuildStrategy?: DocsBuildStrategy;\n    buildLogTransport?: winston.transport;\n    catalogClient?: CatalogApi;\n    httpAuth?: HttpAuthService;\n    auth?: AuthService;\n};\n"})}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.strong,{children:"References:"})," ",(0,o.jsx)(n.a,{href:"/docs/reference/plugin-techdocs-node.preparerbuilder",children:"PreparerBuilder"}),", ",(0,o.jsx)(n.a,{href:"/docs/reference/plugin-techdocs-node.generatorbuilder",children:"GeneratorBuilder"}),", ",(0,o.jsx)(n.a,{href:"/docs/reference/plugin-techdocs-node.publisherbase",children:"PublisherBase"}),", ",(0,o.jsx)(n.a,{href:"/docs/reference/backend-plugin-api.discoveryservice",children:"DiscoveryService"}),", ",(0,o.jsx)(n.a,{href:"/docs/reference/config.config",children:"Config"}),", ",(0,o.jsx)(n.a,{href:"/docs/reference/backend-common.plugincachemanager",children:"PluginCacheManager"}),", ",(0,o.jsx)(n.a,{href:"/docs/reference/plugin-techdocs-node.docsbuildstrategy",children:"DocsBuildStrategy"}),", ",(0,o.jsx)(n.a,{href:"/docs/reference/catalog-client.catalogapi",children:"CatalogApi"}),", ",(0,o.jsx)(n.a,{href:"/docs/reference/backend-plugin-api.httpauthservice",children:"HttpAuthService"}),", ",(0,o.jsx)(n.a,{href:"/docs/reference/backend-plugin-api.authservice",children:"AuthService"})]})]})}function p(e={}){const{wrapper:n}={...(0,t.a)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(l,{...e})}):l(e)}},675251:(e,n,r)=>{var o=r(667294),t=Symbol.for("react.element"),c=Symbol.for("react.fragment"),s=Object.prototype.hasOwnProperty,i=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,a={key:!0,ref:!0,__self:!0,__source:!0};function d(e,n,r){var o,c={},d=null,l=null;for(o in void 0!==r&&(d=""+r),void 0!==n.key&&(d=""+n.key),void 0!==n.ref&&(l=n.ref),n)s.call(n,o)&&!a.hasOwnProperty(o)&&(c[o]=n[o]);if(e&&e.defaultProps)for(o in n=e.defaultProps)void 0===c[o]&&(c[o]=n[o]);return{$$typeof:t,type:e,key:d,ref:l,props:c,_owner:i.current}}n.Fragment=c,n.jsx=d,n.jsxs=d},785893:(e,n,r)=>{e.exports=r(675251)},511151:(e,n,r)=>{r.d(n,{Z:()=>i,a:()=>s});var o=r(667294);const t={},c=o.createContext(t);function s(e){const n=o.useContext(c);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:s(e.components),o.createElement(c.Provider,{value:n},e.children)}}}]);