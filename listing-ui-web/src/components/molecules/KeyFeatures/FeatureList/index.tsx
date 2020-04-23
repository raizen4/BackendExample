import React, { FC, KeyboardEvent } from 'react';
import { setIn, getIn, FieldMetaProps, FieldArrayRenderProps } from 'formik';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import InputText from 'shared/components/molecules/InputText';
import EditableChip from 'shared/components/molecules/EditableChip';
import { IKeyFeature } from '../../../../types/Listing';

const useStyles = makeStyles((theme: Theme) => ({
  chip: {
    margin: theme.spacing(0.5)
  }
}));

const newFeatureFieldName = 'listingDetails.newFeature';

const FeatureList: FC<FieldArrayRenderProps> = ({
  push,
  replace,
  remove,
  form,
  name
}) => {
  const classes = useStyles();
  const {
    getFieldMeta,
    setFieldValue,
    values,
    validateForm,
    setFieldTouched,
    validateField
  } = form;
  const newFeatureMeta = getFieldMeta<string>(newFeatureFieldName);
  const currentFeatures = getFieldMeta<IKeyFeature[]>(name).value || [];

  const addFeature = async (feature: string) => {
    const currentMaxOrder =
      [...currentFeatures].sort((a, b) => b.order - a.order)[0]?.order || 0;
    const nextFeature = {
      feature,
      order: currentMaxOrder + 1
    };
    const updatedValues = setIn(values, newFeatureFieldName, feature);
    const errors = await validateForm(updatedValues);
    if (!getIn(errors, newFeatureFieldName)) {
      push(nextFeature);
      setFieldValue(newFeatureFieldName, '');
      setFieldTouched(newFeatureFieldName, false);
    }
  };

  const editFeature = (index: number, newValue: string): void => {
    replace(index, {
      ...currentFeatures[index],
      feature: newValue
    });
  };

  const handleKeyPress = (event: KeyboardEvent): void => {
    if (event.key === 'Enter' && newFeatureMeta.value?.length > 0) {
      setFieldTouched(newFeatureFieldName, true);
      validateField(newFeatureFieldName);
      addFeature(newFeatureMeta.value);
    }
  };

  const renderFeatures = (): JSX.Element[] =>
    [...currentFeatures]
      .sort((a: IKeyFeature, b: IKeyFeature) => a.order - b.order)
      .map((currentFeature: IKeyFeature) => {
        const featureIndex: number = currentFeatures.findIndex(
          (keyFeature: IKeyFeature) =>
            keyFeature.feature === currentFeature.feature &&
            keyFeature.order === currentFeature.order
        );
        const itemName = `${name}.${featureIndex}`;
        const fieldMeta: FieldMetaProps<IKeyFeature> = getFieldMeta<
          IKeyFeature
        >(itemName);
        return (
          <EditableChip
            key={`${currentFeature.feature}-${currentFeature.order}`}
            name={itemName}
            data-testid={`feature ${featureIndex}`}
            value={fieldMeta.value.feature}
            error={
              fieldMeta.error &&
              (((fieldMeta.error as unknown) as IKeyFeature).feature ||
                fieldMeta.error) // Formik meta type issue for error (always assumes string)
            }
            onEditEnd={(newValue: string) =>
              editFeature(featureIndex, newValue)
            }
            onDelete={() => {
              remove(featureIndex);
            }}
            className={classes.chip}
          />
        );
      });

  return (
    <Grid item container spacing={3}>
      <Grid item xs={12}>
        <InputText
          name={newFeatureFieldName}
          variant="outlined"
          label="Add and edit features"
          fullWidth
          onKeyPress={handleKeyPress}
          id="new-feature"
          placeholder="e.g. Off road parking"
          InputProps={{
            endAdornment: (
              <IconButton
                data-testid="add-feature-button"
                onClick={(): void => {
                  addFeature(newFeatureMeta.value);
                }}
              >
                <AddIcon />
              </IconButton>
            )
          }}
        />
      </Grid>
      <Grid item xs={12}>
        {renderFeatures()}
      </Grid>
    </Grid>
  );
};

export default FeatureList;
