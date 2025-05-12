import React, { useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import BlogItem from "../blog-item/BlogItem";


const BlogList = ({searchValue}) => {

  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token")
  const [listPost, setListPost] = useState([])
  const url = "https://striveblog-s75e.onrender.com/"

  useEffect(()=>{

    const getAllPost = async ()=>{
      try {
        const res = await fetch(url + "blogPosts"  +`/?q=${searchValue}`)

        if(res.ok){
          const json = await res.json()
          setListPost(json)
          setLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }

    getAllPost()
  },[searchValue])

  if(loading){
    
    return <div className="d-flex justify-content-center">
            <Spinner animation="border" role="status" size="md">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
  }else{
  return (
    <Row>
      {listPost.map((post, i) => (
        <Col
          key={`item-${i}`}
          md={4}
          style={{
            marginBottom: 50,
          }}
        >
          <BlogItem key={post.title} {...post} />
        </Col>
      ))}
    </Row>
  );
};
}
export default BlogList;
