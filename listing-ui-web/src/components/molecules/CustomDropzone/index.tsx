import React from 'react';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';

import makeStyles from '@material-ui/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import { Theme } from '@material-ui/core/styles';
import { ICustomDropzoneProps } from './types';

import { red, blue, green, grey } from '@material-ui/core/colors';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2.5),
    borderWidth: 2,
    borderRadius: 2,
    borderColor: `${grey[300]}`,
    borderStyle: 'dashed',
    backgroundColor: `${grey[200]}`,
    color: `${grey[900]}`,
    transition: 'border .24s ease-in-out',
    cursor: 'pointer'
  },
  active: {
    borderColor: blue.A200
  },
  valid: {
    borderColor: green.A200
  },
  invalid: {
    borderColor: red.A200
  }
}));

function CustomDropzone({
  handleOnDrop,
  classes: parentClasses = {},
  multipleFiles,
  name,
  fileTypes
}: ICustomDropzoneProps) {
  const classes = useStyles({});
  let files: string[] = [];

  if (fileTypes) {
    files = fileTypes.map(type => {
      return type.split('/')[1];
    });
  }

  const label = (
    <p>
      Drop your <b>{name ?? 'FILES'}</b> ({files.join(', ')}) here or{' '}
      <b>select</b> from your computer
    </p>
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    draggedFiles
  } = useDropzone({
    onDrop: handleOnDrop,
    accept: fileTypes,
    multiple: multipleFiles
  });

  const dropzoneClasses = [
    classes.root,
    [isDragActive ? classes.active : null],
    [isDragAccept ? classes.valid : null],
    [isDragReject ? classes.invalid : null]
  ];

  let errorMsg = '';

  if (!multipleFiles && draggedFiles.length > 1) {
    errorMsg = 'More than one file was added!';
  } else if (multipleFiles) {
    errorMsg = 'One or more of the files were in the wrong format!';
  } else {
    errorMsg = 'The file was in the wrong format!';
  }

  return (
    <Grid item xs={12}>
      <div
        {...getRootProps({
          className: clsx(dropzoneClasses, parentClasses.root)
        })}
        data-testid="dropzone"
      >
        <input {...getInputProps()} />
        {!isDragActive && label}
        {isDragActive && !isDragReject && <p>Drop me inside the box</p>}
        {isDragReject && <p>{errorMsg}</p>}
      </div>
    </Grid>
  );
}
export default CustomDropzone;
