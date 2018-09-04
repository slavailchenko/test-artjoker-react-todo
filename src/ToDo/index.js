import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: 10,
    marginRight: 10,
    width: 200,
  },
  menu: {
    width: 200,
  },
});


const selectbox = [
  {
    value: 'Twin',
    label: 'Twin'
  },
  {
    value: 'Tripple',
    label: 'Tripple'
  },
  {
    value: 'Quadro',
    label: 'Quadro'
  }
];

const todo_list = [
 {
  select: selectbox[0].label,
  num:  22,
  timestamp: (new Date()).getTime()
 },
 {
  select: selectbox[1].label,
  num:  12,
  timestamp: (new Date()).getTime()+1
 },
 {
  select: selectbox[2].label,
  num:  4,
  timestamp: (new Date()).getTime()+2
 }
];

console.log (localStorage.todo);
    
    if (!(localStorage.todo)){
        localStorage.setItem("todo", JSON.stringify(todo_list));
    }

function todoReducer(state, action){

    console.log (state);
    console.log (JSON.parse(localStorage.todo));
 
    if (typeof state == 'undefined'){
        return {items: JSON.parse(localStorage.todo)};
    }
    if (action.type === 'NEW_TODO'){
        return {items: [...state.items, {select: action.select, num: action.num, timestamp: (new Date()).getTime()}]}
    }
    if (action.type === 'EDIT_TODO') {
        
        for (let i=0;i<state.items.length;i++) {
            if (state.items[i].timestamp === action.timestamp){
                state.items[i] =
                {
                select: action.select,
                num: Number(action.num),
                timestamp: action.timestamp
                };
            }
        }
        let items = [...state.items];
        return {items};
      }

    if (action.type === 'DELETE_TODO'){
        let items = [];
        for (let i=0;i<state.items.length;i++){
            if (state.items[i].timestamp !== action.timestamp){
                items.push(state.items[i]);
            }
        }
        return {items};
    }
}

const reducers = combineReducers({
    todo: todoReducer,
})

var store = createStore(reducers)
store.subscribe(() => {
    let state = store.getState();
    localStorage.todo = JSON.stringify(state.todo.items);
})

class ToDoItem extends Component {
    constructor(props){
        super(props);

        this.state = {
            num: this.props.item.num,
            select: this.props.item.select,
            timestamp: this.props.item.timestamp
    }

        console.log (this.state.num, this.state.select);

        this.delete = this.delete.bind(this);
    }

    handleChange = name => event => {
      this.setState({
        [name]: event.target.value,
          });
        console.log (this.state.timestamp);

        store.dispatch ({type: 'EDIT_TODO',
                        select:  this.state.select,
                        num:   this.state.num,
                        timestamp: this.state.timestamp})
        }

    delete() {
        store.dispatch({type: "DELETE_TODO", timestamp: this.props.item.timestamp})
    }

    render() {
        const { classes } = this.props;
        
        return (
                
      <form className={classes.container} noValidate autoComplete="off">
        
                 <TextField
                      id="select-box"
                      select
                      className={classes.textField}
                      value={this.state.select}
                      onChange={this.handleChange('select')}
                      SelectProps={{
                        MenuProps: {
                          className: classes.menu,
                        },
                      }}
                      margin="normal"
                    >
                      {selectbox.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                 ))}
                </TextField>

                <TextField
                  id="number"
                  value={this.state.num}
                  onChange={this.handleChange('num')}
                  type="number"
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal"
                />
                
                <Button onClick={this.delete} >x</Button>
            </form>
        );
    }
};

ToDoItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

class ToDoForm extends Component {
    constructor (props) {
        super(props);

        this.state = {
            num: '22',
            selectbox: selectbox[0].label,
            clickButton: false,
             };

        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
        this.add = this.add.bind(this);
        
    }

    handleChange = name => event => {
      this.setState({
        [name]: event.target.value,
          });
     };   

    save () {
        
        if (this.state.clickButton){
            store.dispatch({type: 'NEW_TODO',
                            select:  this.state.selectbox,
                            num:   this.state.num});
            // this.setState ({
            // selectbox: 'Twin',
            // num: '22'});
         this.setState({
            clickButton: false,
          });
     }
    }

    add () {
        this.setState({
        clickButton: true,
          });
    }

    cancel () {
        this.setState({
        clickButton: false,
          });
    }


    render () {

        let style = {
            backgroundColor: this.state.valid ? '' : 'red'
        };

        const { classes } = this.props;

        const select = this.state.selectbox;
        const num = this.state.num; 
        console.log(select);
        console.log(num);
        
        return (
  
           <form className={classes.container} noValidate autoComplete="off">
                { this.state.clickButton == true && <div>
                <TextField
                      select
                      value = {this.state.selectbox}
                      onChange={this.handleChange('selectbox')}
                      className={classes.textField}
                      SelectProps={{
                        MenuProps: {
                          className: classes.menu,
                        },
                      }}
                      margin="normal"
                    >
                      {selectbox.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                 ))}
                </TextField>

                <TextField
                  value = {this.state.num}
                  onChange={this.handleChange('num')}
                  type="number"
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal"
                />
            </div> }

                <div>
                    <Button onClick = { this.add } >Add ToDo </Button>
                </div>

                <div>
                    <Button onClick = { this.save } >Save</Button>
                    <Button onClick = { this.cancel }>Cancel</Button>
                </div>

            </form>
        );
    }
};

ToDoForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

class ToDoList extends Component {

    render (){
        return (
            <div> 
                
                { this.props.items.map( (item, index) => <ToDoItem classes={
                {container: 'viewTodo'}, {textField: 'textField'}, {menu: 'menu'}}
                    key={index} item={item} />) }

                <ToDoForm classes={
                {container: 'addTodo'}, {textField: 'textField'}, {menu: 'menu'}}
                /> 

            </div>
        );
    }
}

const mapStateToProps = function(store){
    return {
        items: store.todo.items
    };
}

ToDoList = connect(mapStateToProps)(ToDoList);

class ToDo extends Component {
  render() {
    return (
      <div className="Todo">
        <Provider store={store} >
            <ToDoList />
        </Provider>
      </div>
    );
  }
}

export default withStyles(styles)(ToDo);