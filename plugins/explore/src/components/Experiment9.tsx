/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
  useRef,
  ReactElement,
  ComponentType,
  ReactComponentElement,
  useLayoutEffect,
} from 'react';
import {
  Route,
  Routes,
  createRoutesFromChildren,
  useRoutes,
} from 'react-router';

class RouteRef {}
class Plugin {
  exposeExtension(Extension: Extension): ComponentType {
    return Extension.expose(this);
  }
}

type Extension<T> = {
  expose(plugin: Plugin): T;
};

type ExtensionData = { data: unknown; type: string };

const myPlugin = new Plugin();

const myRouteRef = new RouteRef();

const MyWidgetComponent = () => {
  return <h1>IMMA WIDGIT</h1>;
};

const MyPageComponent = () => {
  return <h1>IMMA PAGE</h1>;
};

type WidgetExtensionData = {
  type: 'WIDGET';
  data: {
    element: JSX.Element;
    size: number;
  };
};

function isWidgetExtensionData(
  extension?: ExtensionData,
): extension is WidgetExtensionData {
  return extension?.type === 'WIDGET';
}

type PageExtensionData = {
  type: 'PAGE';
  data: {
    element: JSX.Element;
    path: string;
    routeRef: RouteRef;
  };
};

function isPageExtensionData(
  extension?: ExtensionData,
): extension is PageExtensionData {
  return extension?.type === 'PAGE';
}

const MyWidgetPageComponent = ({
  extensions,
}: {
  extensions: { type: string; data: unknown }[];
}) => {
  console.log('DEBUG: extensions =', extensions);
  const widgets = extensions
    .filter(isWidgetExtensionData)
    .map(({ data: { element, size } }, index) => (
      <div key={index}>
        Widget of size {size}: {element}
      </div>
    ));

  return (
    <div>
      <h1>HERES SOME WIDGETS</h1>
      {widgets}
    </div>
  );
};

const MyComposableWidgetComponent = ({ items }: { items: WidgetItem[] }) => {
  console.log('DEBUG: items =', items);

  return (
    <div>
      <h1>HERES SOME COMPOSED WIDGETS BRO YEEZY WIDGEZEPTION</h1>
      {items.map(({ element }, index) => (
        <React.Fragment key={index}>{element}</React.Fragment>
      ))}
    </div>
  );
};

const MyPage = myPlugin.exposeExtension(
  createPageExtension({
    component: MyPageComponent,
    routeRef: myRouteRef,
  }),
);

const MyWidgetPage = myPlugin.exposeExtension(
  createPageExtensionPoint({
    component: MyWidgetPageComponent,
    routeRef: myRouteRef,
  }),
);

const MyWidget = myPlugin.exposeExtension(
  createWidgetExtension({
    component: MyWidgetComponent,
    size: 1,
  }),
);

const MyTechDocsAddon = myPlugin.exposeExtension(
  createTechDocAddon({
    factory: () => Math.random(),
  }),
);

const MyMultiWidget = myPlugin.exposeExtension(
  createWidgetExtensionPoint({
    component: MyComposableWidgetComponent,
    size: 2,
  }),
);

function createTechDocAddon(conf: {
  factory: () => number;
}): Extension<ComponentType<{}>> {
  return {
    expose(_plugin) {
      const Wrapper = () => null;
      Wrapper.inflate = () => ({
        type: 'TECHDOCS_ADDON',
        factory: conf.factory,
      });
      return Wrapper;
    },
  };
}

type WidgetItem = {
  element: JSX.Element;
  size: number;
};

function createWidgetExtensionPoint(conf: {
  component: ComponentType<{ items: WidgetItem[] }>;
  size: number;
}): Extension<ComponentType<{}>> {
  const { component: Component, size } = conf;
  return {
    expose(_plugin) {
      const Wrapper = () => null;

      Wrapper.inflate = ({ children, ...props }) => {
        const items = inflateChildren(children)
          .filter(isWidgetExtensionData)
          .map(({ data }) => data);
        return {
          type: 'WIDGET',
          data: {
            element: <Component {...props} items={items} />,
            size,
          },
        };
      };
      return Wrapper;
    },
  };
}

function createWidgetExtension(conf: {
  component: ComponentType<{}>;
  size: number;
}): Extension<ComponentType<{}>> {
  const { size, component: Component } = conf;

  return {
    expose(_plugin) {
      const Wrapper = () => null;
      Wrapper.inflate = (props: any) => ({
        type: 'WIDGET',
        data: {
          element: <Component {...props} />,
          size,
        },
      });
      return Wrapper;
    },
  };
}

type InflateFunc = (props: {}) => ExtensionData;

function inflateChildren(
  children: PropsWithChildren<{}>['children'],
): ExtensionData[] {
  return React.Children.toArray(children)
    .map(child => {
      if (!child) {
        return undefined;
      }
      const {
        props,
        type: { inflate },
      } = child as { props: {}; type: { inflate?: InflateFunc } };
      if (!inflate) {
        return undefined;
      }

      return inflate(props);
    })
    .filter((d): d is ExtensionData => Boolean(d));
}

function createPageExtensionPoint(conf: {
  component: ComponentType<{ extensions: ExtensionData[] }>;
  routeRef: RouteRef;
}): Extension<ComponentType<{ path: string }>> {
  const { component: Component, routeRef } = conf;
  return {
    expose(_plugin) {
      const Wrapper = () => null;

      Wrapper.inflate = ({
        children,
        ...props
      }: PropsWithChildren<{ path: string }>) => ({
        type: 'PAGE',
        data: {
          element: (
            <Component {...props} extensions={inflateChildren(children)} />
          ),
          path: props.path,
          routeRef,
        },
      });
      return Wrapper;
    },
  };
}

/*

Wrapper component -> props passed from app

ExtensionPoint Component -> props from app + extensions

extensions -> discovered from children of Wrapper component

*/

function collectReactExtensions(children: ReactNode): ReactNode {
  return inflateChildren(children)
    .filter(isPageExtensionData)
    .map(({ data }) => data.element)[0];
}

export const Experiment = () => {
  return collectReactExtensions(
    <BackstageRouter>
      <MyWidgetPage path="/my-widgets">
        <MyWidget />
        <MyMultiWidget>
          <MyWidget />
          <MyMultiWidget>
            <MyWidget />
            <MyMultiWidget>
              <MyWidget />
              <MyWidget />
              <MyWidget />
              <MyWidget />
              <MyTechDocsAddon />
            </MyMultiWidget>
          </MyMultiWidget>
        </MyMultiWidget>
      </MyWidgetPage>
      <MyPage path="/my-thing" />
    </BackstageRouter>,
  );
};

function createPageExtension(conf: {
  component: ComponentType<{}>;
  routeRef: RouteRef;
}): Extension<ComponentType<{ path: string }>> {
  const { component: Component, routeRef } = conf;
  return {
    expose(_plugin) {
      const Wrapper = () => null;
      Wrapper.inflate = (props: { path: string }) => ({
        type: 'PAGE',
        data: {
          element: <Component {...props} />,
          path: props.path,
          routeRef,
        },
      });
      return Wrapper;
    },
  };
}

const rootRouteRef = new RouteRef();

const BackstageRouterComponent = ({
  extensions,
}: {
  extensions: ExtensionData[];
}) => {
  const routes = extensions
    .filter(isPageExtensionData)
    .map(({ data: { element, path } }) => ({
      element,
      path: `${path}/*`,
    }));
  console.log('DEBUG: routes =', routes);
  return useRoutes(routes, '');
};

const BackstageRouter = myPlugin.exposeExtension(
  createPageExtensionPoint({
    component: BackstageRouterComponent,
    routeRef: rootRouteRef,
  }),
);

// const BackstageRouter = ({ children }: PropsWithChildren<{}>) => {
//   const routes = React.Children.map(
//     children,
//     ({
//       type: {
//         extension: {
//           data: { Component },
//           collect,
//         },
//       },
//       props,
//     }) => {
//       const collectedProps = collect?.(props.children) ?? {};
//       return {
//         element: <Component {...collectedProps} />,
//         path: `${props.path}/*`,
//       };
//     },
//   );
//   console.log('DEBUG: routes =', routes);

//   return useRoutes(routes!, '');
// };
