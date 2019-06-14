import React, { Component } from 'react'
import AddUser from "../component/AddUser";
import { Modal, Button, Input, Icon, DatePicker } from "antd";
import ListUser from '../component/ListUser'
export class Content extends Component {
    state = {
        listView: false
    }
    handleClick(e) {
        this.setState(prevState => ({
            listView : !prevState.listView
        }))
    }
    render() {
        return (
            <div  className = "ant-layout-content">
                <AddUser />
                <Button onClick ={() => this.handleClick()}>
                    List The User
                </Button>
                {this.state.listView ? <ListUser />  : null}
            </div>
        )
    }
}

export default Content
