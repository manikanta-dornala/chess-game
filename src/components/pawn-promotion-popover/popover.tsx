import React, { Component, createRef } from 'react';
// import './Popover.css'; // Add your styling here

interface PopoverProps {
    show: boolean;
    onClose: () => void;
    children: React.ReactNode;
    coord: { x: number; y: number };
}

export default class Popover extends Component<PopoverProps> {
    private popoverRef = createRef<HTMLDivElement>();

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event: MouseEvent) => {
        if (
            this.popoverRef.current &&
            !this.popoverRef.current.contains(event.target as Node)
        ) {
            this.props.onClose();
        }
    };

    render() {
        const { show, children, coord } = this.props;

        if (!show) return null;

        return (
            <div
                ref={this.popoverRef}
                className="popover"
                style={{
                    top: coord.y,
                    left: coord.x,
                    position: 'absolute',
                    zIndex: 500,
                }}
            >
                {children}
            </div>
        );
    }
}
