import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';


const styles = ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: 10,
    marginRight: 10,
    width: 120,
  },
  btnDelete: {
        padding: 15,
        zoom: '0.7',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        color: 'red',
        fontSize: 'x-large'
    },
   btnAdd: {
        marginTop: 10,
        marginBottom: 10,
        color: '#3f51b5',
        fontSize: 'medium'
   }
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
});

class ToDoItem extends Component {
    constructor(props){
        super(props);

        this.state = {
            num: this.props.item.num,
            select: this.props.item.select,
            timestamp: this.props.item.timestamp
    }

        this.edit = this.edit.bind (this);
        this.delete = this.delete.bind(this);
    }

    handleChange = name => event => {
      this.setState({
        [name]: event.target.value,
          });
       console.log (this.state.timestamp);
       setTimeout (this.edit(), 2000);
    };

    edit () {
             
        store.dispatch ({type: 'EDIT_TODO',
                        select:  this.state.select,
                        num:   this.state.num,
                        timestamp: this.state.timestamp});
                    
    }

    delete() {
        store.dispatch({type: "DELETE_TODO", timestamp: this.props.item.timestamp})
    }

    render() {
        const { classes } = this.props;
   
        return (
                
          <form className={classes.container} 
                style = {{marginLeft: '10px'}}
                noValidate autoComplete="off">
            
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
                          style = {styles.textField}
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
                      style = {styles.textField}
                    />
                    <Button
                        style={styles.btnDelete}
                        onClick={this.delete}> X
                    </Button>
                    
                </form>
        );
    }
};

ToDoItem.propTypes = {
  classes: PropTypes.object.isRequired
};

export class ToDoForm extends Component {
    constructor (props) {
        super(props);

        this.state = {
            num: '22',
            selectbox: selectbox[0].label,
            clickButton: false,
            };

        this.save = this.save.bind(this);
        this.add = this.add.bind(this);
        
    }

  componentDidMount() {
    this.props.onRef(this)
  }

  componentWillUnmount() {
      this.props.onRef(undefined)
  }

  handleChange = name => event => {
      this.setState({
        [name]: event.target.value,
          });
     }; 

  save () {

         this.setState({
            clickButton: false,
          });

        if (this.state.clickButton){
            store.dispatch({type: 'NEW_TODO',
                            select:  this.state.selectbox,
                            num:   this.state.num});
          }
    }

    add () {
        this.setState({
        clickButton: true,
        });
    }

    render () {

        const { classes } = this.props;

        return (
  
           <form className={classes.container} style = {{marginLeft: '10px'}}
           noValidate autoComplete="off">
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
                      style = {styles.textField}
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
                  style = {styles.textField}
                />
            </div> }

                <div>
                    <Button style = {styles.btnAdd} 
                     onClick = { this.add } >ДОБАВИТЬ</Button>
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

export default ToDo;