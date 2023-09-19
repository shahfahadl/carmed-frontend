import { useState, useEffect, useRef } from 'react';
import { Map, Marker, GoogleApiWrapper, Circle } from 'google-maps-react';
import getConfig from 'next/config';
import { geocodeByLatLng } from 'react-google-places-autocomplete';
const { publicRuntimeConfig } = getConfig();
import toast from 'react-hot-toast';

const googleKey = publicRuntimeConfig.googlePlacesAPI;
const Loading = () => {
    return <h1>loading</h1>;
};

const GoogleMap = ({ currentLatLng, setCurrentLatLng, setApproxiamteName, initialCords=null }) => {
    const ref = useRef(null);
    const [map, setMap] = useState();

    useEffect(() => {
        if (ref.current && !map) {
            setMap(new window.google.maps.Map(ref.current, {}));
        }
    }, [ref, map]);

    const markerClicked = async (e, map, clickEvent) => {
        if(!setCurrentLatLng || !setApproxiamteName){
            return;
        }
        
        const latLng = {
            lat: clickEvent.latLng.lat(), 
            lng: clickEvent.latLng.lng()
        };
        setCurrentLatLng(latLng)
        try {
            const res = await geocodeByLatLng(latLng);
            if(res && res.length > 0){
                res.forEach((area)=>{
                    if(area.types[0] === "administrative_area_level_2"){
                        area.address_components.map((components)=>{
                            if(components.types[0] === "administrative_area_level_2")
                                setApproxiamteName(components.short_name)
                        })
                    }
                })
            }
        } catch (error) {
            toast.error("We don't operate in that area yet");
        }
    }

    const coords = { lat: -21.805149, lng: -49.0921657 };

    return (
        <Map 
            center={currentLatLng}
            initialCenter={initialCords || coords} 
            google={window.google} 
            zoom={14} 
            containerStyle={
                {width: 500, height: 500, position: 'relative'}
            }
            onClick={markerClicked}
        >

            <Marker 
                name={'Current location'} 
                mapCenter={currentLatLng}
            />
                <Circle
                    radius={20}
                    center={currentLatLng || initialCords || coords}
                    strokeColor='transparent'
                    strokeOpacity={0}
                    strokeWeight={5}
                    fillColor='#FF0000'
                    fillOpacity={1}
                />
        </Map>
    )
}

export default GoogleApiWrapper({
    apiKey: googleKey,
    LoadingContainer: Loading
})(GoogleMap);
