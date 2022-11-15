import React from 'react'
import { Button } from '@mui/material'
import './HeaderItem.css'

export default function HeaderItem(props) {
    const content = () => {
        if (props.text) {
            return (
                <Button
                    className='header-item-button'
                    onClick={props.setPage}
                    disabled={props.disabled}
                >
                    <h1 className={`header-item-text ${props.text.toLowerCase()}`}>
                        {props.text}
                    </h1>
                </Button>

            )
        } else if (props.content) {
            return props.content
        }
    }

    return (
        <div className='header-item'>
            {content()}
        </div>
    )
}