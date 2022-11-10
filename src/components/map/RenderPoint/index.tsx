import { ReactElement } from 'react';
import { data } from 'azure-maps-control';
import { AzureMapFeature, IAzureMapFeature } from 'react-azure-maps';
const RenderPoint = (coordinates: data.Position): ReactElement<IAzureMapFeature> => {
    const rendId = Math.random();
    return (
        <AzureMapFeature
            key={rendId}
            id={rendId.toString()}
            type="Point"
            coordinate={coordinates}
            properties={{
                id: rendId,
                prop: 'My Feature Prop',
            }}
        />
    );
};

export default RenderPoint;