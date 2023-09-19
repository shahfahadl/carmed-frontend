import React, { useEffect, useState } from 'react';
import PlacesAutocomplete, {
    geocodeByAddress
} from 'react-places-autocomplete';
import styled from 'styled-components';
import { useDebounce } from '@hooks/debounce';
import { SimpleInput } from '@elements/input';

import getConfig from 'next/config';
import { GoogleApiWrapper } from 'google-maps-react';
import { Loading } from '@nextui-org/react';
const { publicRuntimeConfig } = getConfig();

const googleKey = publicRuntimeConfig.googlePlacesAPI;
const LoadingRenderer = () => {
    return <Loading/>;
};

const CustomMenu = styled.div`
    position: absolute;
    z-index: 10;
    margin-top: 5px;
    display: flex;
    flex-direction: column;
    padding: 10px 5px;
    border-radius: 5px;
    background: ${({ theme }) => theme.colors.box};
    width: fit-content;
    row-gap: 4px;
`

const Dropdown = styled.div`
`

const CustomItem = styled.div`
    max-width: 240px;
    white-space: nowrap;
    overflow-x: hidden;
    font-size: 12px;
    text-overflow: ellipsis;
    padding: 2px 5px;
    cursor: pointer;
    &:hover{
        color: white;
        .full-name{
            opacity: 1 !important;
        }
    }
    &.border{
        border-bottom: 1px solid rgba(0,0,0,0.1);
    }

    .full-name{
        opacity: 0;
        border-radius: 3px;
        background: ${({ theme }) => theme.colors.darkPurple};
        color: white;
        font-size: 12px;
        padding: 2px 5px;
        position: absolute;
        margin-top: -22px;
    }
`

const AutoCompleteInput = styled(SimpleInput)`
    ${({ suggestions }) => {
        if (suggestions) {
            return `
                border-bottom: none !important;
                border-radius: 3px 3px 0 0 !important;
            `;
        }
    }}
`;

const AutoComplete = ({ label = "Label here", onAddressChange, setApproxiamteName }) => {
    const [state, setState] = useState('');
    const finalSearch = useDebounce(state, 1000);

    const handleChange = (address) => {
        setState(address);
    };

    useEffect(() => {
        onFinalSearch();
    }, [finalSearch]);

    const onFinalSearch = async () => {
        if (finalSearch !== '' && window.google) {
            const addressDetails = await geocodeByAddress(finalSearch);
            if (addressDetails !== null) {
                addressDetails[0].address_components.map((components)=>{
                    if(components.types[0] === "administrative_area_level_2")
                        setApproxiamteName(components.short_name)
                })
                onAddressChange({
                    lat: addressDetails[0].geometry.location.lat(),
                    lng: addressDetails[0].geometry.location.lng()
                })
            }
        }
    }

    const handleSelect = async (address) => {
        setState(address);
        let addressDetails = null;
        try {
            addressDetails = await geocodeByAddress(address);
        } catch (error) {
            console.log('error', error);
        }
        if (addressDetails !== null) {
            addressDetails[0].address_components.map((components)=>{
                if(components.types[0] === "administrative_area_level_2")
                    setApproxiamteName(components.short_name)
            })

            onAddressChange({
                lat: addressDetails[0].geometry.location.lat(),
                lng: addressDetails[0].geometry.location.lng()
            })
        }
    };

    return (
        <>
            
                <PlacesAutocomplete
                    value={state}
                    onChange={handleChange}
                    onSelect={handleSelect}
                    debounce={1000}
                >
                    {({
                        getInputProps,
                        suggestions,
                        loading,
                        getSuggestionItemProps,
                    }) => (
                        <Dropdown>
                            <AutoCompleteInput
                                placeholder={label}
                                label={label}
                                {...getInputProps()}
                            />
                            {(state.length > 0 && suggestions.length > 0) ?
                                <CustomMenu aria-label="Static Actions"
                                    suggestions={
                                        suggestions.length > 0 ? '1' : '0'
                                    }
                                >
                                    {loading && <CustomItem>Loading...</CustomItem>}
                                    {suggestions.map((suggestion, index) => (
                                        <CustomItem
                                            {...getSuggestionItemProps(
                                                suggestion,
                                            )}
                                            key={suggestion.placeId}
                                            className={(index + 1 !== suggestions.length) ? 'border' : ""}
                                        >
                                            {suggestion.description}
                                            <div className='full-name' >{suggestion.description}</div>
                                        </CustomItem>
                                    ))}
                                </CustomMenu>
                                : <></>}
                        </Dropdown>
                    )
                    }
                </PlacesAutocomplete>
            

        </>
    );
}

export default GoogleApiWrapper({
    apiKey: googleKey,
    LoadingContainer: LoadingRenderer
})(AutoComplete);