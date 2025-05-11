import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import BlogItem from "../blog-item/BlogItem";


const BlogList = ({searchValue}) => {

  const keyFetch = localStorage.getItem("token")
  const [listPost, setListPost] = useState([])
  const url = process.env.REACT_APP_URL

  useEffect(()=>{

    const getAllPost = async ()=>{
      try {
        const res = await fetch(url + "blogPosts"  +`/?q=${searchValue}`, {
          headers:{
            Authorization: keyFetch
          }
        })

        if(res.ok){
          const json = await res.json()
          setListPost(json)
        }
      } catch (error) {
        console.log(error)
      }
    }

    getAllPost()
  },[searchValue])

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

export default BlogList;
