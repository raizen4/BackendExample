import React from 'react';
import clsx from 'clsx';

import { Theme, fade } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import grey from '@material-ui/core/colors/grey';
import yellow from '@material-ui/core/colors/yellow';
import indigo from '@material-ui/core/colors/indigo';
import blue from '@material-ui/core/colors/blue';
import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';
import GridListTile from '@material-ui/core/GridListTile';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import GetAppIcon from '@material-ui/icons/GetApp';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import StarRateTwoToneIcon from '@material-ui/icons/StarRateTwoTone';
import CircularProgress from '@material-ui/core/CircularProgress';
import { IWrappedThumb, IWrappedThumbProps, IThumbProps } from './types';
import placeholderImage from '../../../images/image_placeholder.png';
import { FILE_DOMAIN_URL } from '../../../configuration/domains';

const greyish = grey[400];
const white = grey[50];
const blueish = indigo[500];
const aqua = blue[200];

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%',
    display: 'block',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderRadius: '2px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    '&:hover, &:focus': {
      '& $buttonRoot, & $groupSelectButton, & $downloadButton, & $imgOverlay': {
        opacity: 1,
        visibility: 'visible'
      }
    },
    '&$groupSelected': {
      '& $imgOverlay': {
        backgroundColor: `${fade(blueish, 0.8)}`
      },
      '& $buttonRoot, & $groupSelectButton, & $downloadButton, & $imgOverlay': {
        opacity: 1,
        visibility: 'visible'
      }
    },
    '&$isUploading': {
      '& $img': {
        filter: `blur(2px)`
      },
      '& $imgOverlay': {
        backgroundColor: `${fade(greyish, 0.3)}`,
        opacity: 1
      }
    }
  },

  img: {},

  buttonRoot: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0,
    zIndex: 3,
    '&:focus': {
      opacity: 1,
      '& ~ $groupSelectButton, & ~ $downloadButton, & ~ $imgOverlay': {
        opacity: 1
      }
    }
  },
  selected: {
    borderColor: fade(aqua, 0.8)
  },
  groupSelected: {},

  imgOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    zIndex: 2,
    backgroundColor: `${fade(greyish, 0.8)}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  groupSelectButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 4,
    opacity: 0,
    '&:focus': {
      opacity: 1,
      '& ~ $imgOverlay': {
        opacity: 1
      }
    }
  },

  downloadButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    zIndex: 4,
    opacity: 0,
    '&:focus': {
      opacity: 1,
      '& ~ $imgOverlay': {
        opacity: 1
      }
    }
  },

  isPrimary: {
    position: 'absolute',
    color: `${yellow[500]}`,
    bottom: '100%',
    left: '0',
    top: '0',
    zIndex: 4
  },

  previewButtonWrapper: {
    position: 'absolute',
    transform: 'translate(-50%,-50%)',
    left: '50%',
    top: '50%'
  },

  previewButton: {
    backgroundColor: `${fade(white, 0)}`,
    border: `2px solid ${fade(blueish, 1)}`,
    outline: 'none',
    borderRadius: '1000px',
    color: `${fade(white, 1)}`,
    borderColor: `${fade(white, 1)}`,
    fontSize: 16,
    padding: `${theme.spacing(0.25)}px ${theme.spacing(1)}px`
  },
  isUploading: {}
}));

const WrappedThumb = React.forwardRef<HTMLImageElement, IWrappedThumbProps>(
  (props, ref) => {
    const classes = useStyles({});

    const ButtonBaseClick = props.isGroupSelected
      ? props.handleToggleFromGroupSelect
      : props.onCurrentAssetClick;

    function AssetSource(): string {
      if (props.image.preview) {
        return props.image.preview;
      } else {
        return `${FILE_DOMAIN_URL}/${props.image.uri}`;
      }
    }

    if (props.image.isUploading) {
      return (
        <div className={clsx(classes.root, classes.isUploading)}>
          <img
            src={AssetSource()}
            alt={props.image.name || 'something went wrong'}
            data-testid="thumb-image"
            ref={ref}
            className={classes.img}
          />
          <div className={classes.imgOverlay}>
            <CircularProgress data-testid="thumb-spinner" />
          </div>
        </div>
      );
    }

    return (
      <div
        className={clsx(
          classes.root,
          props.isSelected && classes.selected,
          props.isGroupSelected && classes.groupSelected
        )}
      >
        <img
          src={
            props.image.fileType && !props.image.fileType.includes('image')
              ? placeholderImage
              : props.image.preview
              ? props.image.preview
              : `${FILE_DOMAIN_URL}/${props.image.uri}`
          }
          alt="Something went wrong"
          data-testid="thumb-image"
          ref={ref}
          className={classes.img}
        />
        <ButtonBase
          disabled={props.isSelected}
          disableRipple
          onClick={ButtonBaseClick}
          className={classes.buttonRoot}
          data-testid={`thumb-button-${props.i}`}
        >
          <div className={classes.previewButtonWrapper}>
            {props.isGroupSelected ? (
              <span className={classes.previewButton}>Deselect</span>
            ) : (
              <span className={classes.previewButton}>Preview</span>
            )}
          </div>
        </ButtonBase>
        <div className={classes.isPrimary}>
          {props.image.isPrimary && (
            <StarRateTwoToneIcon data-testid="primary-star" />
          )}
        </div>
        <IconButton
          className={classes.groupSelectButton}
          onClick={props.handleToggleFromGroupSelect}
          color="primary"
          aria-label="group select"
        >
          {props.isGroupSelected ? (
            <CheckCircleOutlineIcon
              fontSize="small"
              data-testid="checked-icon"
            />
          ) : (
            <RadioButtonUncheckedIcon
              fontSize="small"
              data-testid="unchecked-icon"
            />
          )}
        </IconButton>
        <IconButton
          className={classes.downloadButton}
          color="primary"
          aria-label="download"
          href={AssetSource()}
          download={props.image.name}
          target="_blank"
        >
          <GetAppIcon fontSize="small" data-testid="download-icon" />
        </IconButton>
        <div className={classes.imgOverlay} />
      </div>
    );
  }
) as IWrappedThumb;

WrappedThumb.muiName = 'Image';

function Thumb({ style, ...props }: IThumbProps) {
  return (
    <GridListTile style={style}>
      <WrappedThumb {...props} />
    </GridListTile>
  );
}

export default Thumb;
