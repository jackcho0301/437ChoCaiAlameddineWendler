import React from 'react'
import { Button } from '@mui/material'
import './HeaderItem.css'

export default function HeaderItem(props) {

    return (
        <Button
            className='header-item'
            onClick={props.setPage}
            >
            <h1 className='header-item-text'>
                {props.text}
            </h1>
        </Button>
    )
}