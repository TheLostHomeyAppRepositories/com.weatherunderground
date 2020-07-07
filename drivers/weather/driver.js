'use strict';

const Homey = require( 'homey' );

class WeatherDriver extends Homey.Driver
{

    onInit()
    {
        this.log( 'WeatherDriver has been init' );

        this.feelLike = new Homey.FlowCardTriggerDevice( 'measure_temperature_feelsLike_changed' );
        this.feelLike
        .register()
    }

    onPair( socket )
    {
        socket.on( 'validate', ( settings, callback ) =>
        {
            this.log( 'onPair validate called: ' + settings );
            Homey.app.getPlaceID( settings, null ).then( placeID =>
            {
                this.log( 'onPair placeID = ' + placeID );
                callback( null, placeID );
            } ).catch( err =>
            {
                this.log( 'onPair placeID = ' + err );
                callback( null, false );
            } );
        } );
    }

    // this is the easiest method to overwrite, when only the template 'Drivers-Pairing-System-Views' is being used.
    onPairListDevices( data, callback )
    {
        // Required properties:
        //"data": { "id": "abcd" },

        // Optional properties, these overwrite those specified in app.json:
        // "name": "My Device",
        // "icon": "/my_icon.svg", // relative to: /drivers/<driver_id>/assets/
        // "capabilities": [ "onoff", "dim" ],
        // "capabilitiesOptions: { "onoff": {} },

        // Optional properties, device-specific:
        // "store": { "foo": "bar" },
        // "settings": { "my_setting": "my_value" },

        callback( null, null );
    }
    
    async triggerFeelLike( Device, Value )
    {
        // trigger the card
        this.log( "Triggering feels like changed with: ", Value );
        let tokens = { 'feelsLike': Value };
        let state = {};

        this.feelLike.trigger( Device, tokens, state )
            .then( this.log )
            .catch( this.error )
    }

}

module.exports = WeatherDriver;