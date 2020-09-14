import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody,
    CardTitle ,BreadcrumbItem, Breadcrumb,Modal,ModalHeader,ModalBody,Label,Row,Button} from 'reactstrap';
import {Link} from 'react-router-dom'
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);



class Commentform extends Component{
    constructor(props){
        super(props);
        this.state={
            isModalOpen:false
        }
        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        console.log(this.props.postComment);
    }
    toggleModal() {
        this.setState({
          isModalOpen: !this.state.isModalOpen
        });
    }
    handleSubmit(values) {
        this.toggleModal();
        this.props.postComment(this.props.dishId, values.rating, values.Name, values.Comment);
    }
    render(){
        return(
            <React.Fragment>
                <Button onClick={this.toggleModal}><i className="fa fa-pencil" aria-hidden="true"></i> Submit Comment</Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                            <Row className="form-group m-1">
                                <Label htmlFor="Rating" >Rating</Label>
                                <Control.select  class="form-control" model=".rating" id="Rating" >
                                    <option value="5">5</option>
                                    <option value="4">4</option>
                                    <option value="3">3</option>
                                    <option value="2">2</option>
                                    <option value="1">1</option>
                                </Control.select>
                            </Row>
                            <Row className="form-group m-1">
                                <Label htmlFor="Name" >Your Name</Label>
                                <Control.text model=".Name" id="Name" name="Name"
                                        placeholder="Your Name"
                                        validators={{
                                            required, minLength: minLength(3), maxLength: maxLength(15)
                                        }}
                                    className="form-control"/>
                                    <Errors
                                    className="text-danger"
                                    model=".Name"
                                    show="touched"
                                    messages={{
                                        required: 'Required',
                                        minLength: 'Must be greater than 2 characters',
                                        maxLength: 'Must be 15 characters or less'
                                    }}
                                    />
                            </Row>
                            <Row className="form-group m-1">
                                <Label htmlFor="Comment" >Comment</Label>
                                <Control.textarea model=".Comment" id="Comment" name="Comment"
                                        placeholder="Comment"
                                    className="form-control" rows="6"/>
                                    
                            </Row>
                            <Row className="form-group m-1">
                                <Button type="submit"  color="primary">Submit</Button>
                            </Row>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </React.Fragment>
        );
    }
} 
function RenderDish({dish}){
    return(
        <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
            <Card>
                <CardImg top src={baseUrl + dish.image} alt={dish.name} />
                <CardBody>
                    <CardTitle>{dish.name}</CardTitle>
                    <CardText>{dish.description}</CardText>
                </CardBody>
            </Card>
        </FadeTransform>
     );
}
function RenderComments({comments, postComment, dishId}){
    
    const commentItem=comments.map((comment)=>{
        const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const year=comment.date.substring(0,4);
        const month=comment.date.substring(5,7);
        const day=comment.date.substring(8,10);
        const author="-- "+comment.author+", "+months[parseInt(month)-1]+" "+day+", "+year;
        //console.log(author);
        return(
            <div key={comment.id}>
                <Fade in>
                <p>{comment.comment}</p>
                <p>{author}</p>
                </Fade>
            </div>
        );
    });
    console.log(commentItem);
    return (
        <div>
            <Stagger in>
            {commentItem}
            <Commentform dishId={dishId} postComment={postComment} /> 
            </Stagger>
        </div>
        
    );
}
    const DishDetailComponent =(props) =>{
        if (props.isLoading) {
            return(
                <div className="container">
                    <div className="row">            
                        <Loading />
                    </div>
                </div>
            );
        }
        else if (props.errMess) {
            return(
                <div className="container">
                    <div className="row">            
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            );
        }
        else if (props.dish != null){
            return(
                <div className="container">
                    <div className="row">
                        <Breadcrumb>

                            <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <div className="col-12">
                            <h3>{props.dish.name}</h3>
                            <hr />
                        </div>                
                    </div>
                    <div className="row">
                        <div  className="col-12 col-md-5 m-1">
                            <RenderDish dish={props.dish}/>
                        </div>
                        <div className="col-12 col-md-5 m-1">
                            <h4>Comments</h4>
                            <RenderComments comments={props.comments}
                                postComment={props.postComment}
                                dishId={props.dish.id}
                            />
                        </div>
                    </div>
                </div>
                
            );  
        }
        else
            return(
                <div></div>
            );
    }

export default DishDetailComponent;