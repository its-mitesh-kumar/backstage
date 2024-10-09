/*
 * Copyright 2023 The Backstage Authors
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

import { CompoundEntityRef, Entity } from '@backstage/catalog-model';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import { Theme, makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useEntityPresentation } from '../../apis';
import Typography from '@material-ui/core/Typography';

/**
 * The available style class keys for {@link EntityDisplayName}, under the name
 * "CatalogReactEntityDisplayName".
 *
 * @public
 */
export type CatalogReactEntityDisplayNameClassKey = 'root' | 'icon';

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      maxWidth: '100%',
    },
    icon: {
      marginRight: theme.spacing(0.5),
      color: theme.palette.text.secondary,
      '& svg': {
        verticalAlign: 'middle',
      },
    },
    truncate: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '100%',
      display: 'block',
    },
  }),
  { name: 'CatalogReactEntityDisplayName' },
);

/**
 * Props for {@link EntityDisplayName}.
 *
 * @public
 */
export type EntityDisplayNameProps = {
  entityRef: Entity | CompoundEntityRef | string;
  hideIcon?: boolean;
  disableTooltip?: boolean;
  defaultKind?: string;
  defaultNamespace?: string;
};

/**
 * Shows a nice representation of a reference to an entity.
 *
 * @public
 */
export const EntityDisplayName = (
  props: EntityDisplayNameProps,
): JSX.Element => {
  const { entityRef, hideIcon, disableTooltip, defaultKind, defaultNamespace } =
    props;

  const classes = useStyles();
  const { primaryTitle, secondaryTitle, Icon } = useEntityPresentation(
    entityRef,
    { defaultKind, defaultNamespace },
  );

  // The innermost "body" content
  let content = (
    <Typography className={classes.truncate}>{primaryTitle}</Typography>
  );

  // Optionally an icon, and wrapper around them both
  content = (
    <Box component="span" className={classes.root}>
      {Icon && !hideIcon ? (
        <Box component="span" className={classes.icon}>
          <Icon fontSize="inherit" />
        </Box>
      ) : null}
      {content}
    </Box>
  );

  // Optionally, a tooltip as the outermost layer
  if (secondaryTitle && !disableTooltip) {
    content = (
      <Tooltip enterDelay={1500} title={secondaryTitle}>
        {content}
      </Tooltip>
    );
  }

  return content;
};
