import React, { Component } from 'react'
import AddUser from "../component/AddUser";
import { Modal, Button, Input, Icon, DatePicker } from "antd";
import ListUser from '../component/ListUser'
import { Container } from 'reactstrap';
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
            <Container>
            <div  className = "ant-layout-content">
                <AddUser />
                 <ListUser />
                {/*<Button onClick ={() => this.handleClick()}>
                    List The User
                </Button>
                {this.state.listView ? <ListUser />  : null}*/}
            </div>
            </Container>
        )
    }
}

export default Content
