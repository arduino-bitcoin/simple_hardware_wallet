import React, { Component } from 'react';
import Proptypes from 'prop-types';
import { Wrapper } from './styled';

class Embed extends Component {
    render() {
        const { src } = this.props;

        if(!src) {
            return null;
        }

        return (
            <Wrapper  src={src} />
        );
    }
}

Embed.proptypes = {
    src: Proptypes.string
}

export default Embed;
