import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import SvgIcon from '@material-ui/core/SvgIcon';
import {grey900} from '@material-ui/core/color';
import logo from './logo.svg';
import './App.css';

import ToDo from '../ToDo';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});

const HomeIcon = (props) => (
    <SvgIcon {...props}>
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
    </SvgIcon>
);

class SimpleModal extends Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    const BtnCloseModal = (props) => (
            <HomeIcon
                style={{
                      padding: 20,
                      cursor: 'pointer'
                  }}
                color={grey900}
                onClick={this.handleClose}
            />
        );

    return (
     <div>
        <Typography gutterBottom>Нажмите для отображения модального окна</Typography>
        <Button onClick={this.handleOpen}>Открыть</Button>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
        >

          <div style={getModalStyle()} className={classes.paper}>
            <div className="Modal-header" style={{width: '90%', 
                                                  backgroundColor: '#80808042'}}>
                <h2 style={{float:'left', paddingLeft: '20px'}}>Структура номеров</h2> <BtnCloseModal />
            </div>

            <ToDo />

          </div>
        </Modal>
      </div>
    );
  }
}

SimpleModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

const SimpleModalWrapped = withStyles(styles)(SimpleModal);

export default SimpleModalWrapped;
