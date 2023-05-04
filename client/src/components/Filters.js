import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form'


class Filters extends React.Component {

    

    createBrand = (brand) => {

        return (
            <Form key={"f" + brand.brandID.toString()}>
                <Form.Check 
                    type="switch"
                    id={`custom-switch-${brand.brandID}`}
                    key={brand.brandID.toString()}
                    checked={brand.value}
                    label={brand.name}
                    onChange={() => {
                                        if(brand.value === false) brand.value = true;
                                        else brand.value = false;
                                        this.props.filterCars(brand.name, brand.value, 0)}
                                    }
                />
            </Form>
        );
    }

    createCategory = (category) => {
        return (
            <Form key={"f" + category.catID.toString()}>
                <Form.Check
                    type="switch"
                    id={`custom-switch-${category.catID}`}
                    key={category.catID.toString()}
                    checked={category.value}
                    label={category.name}
                    onChange={() => {
                                        if(category.value === false) category.value = true;
                                        else category.value = false;
                                        this.props.filterCars(category.name, category.value, 1)}
                    }
                />
            </Form>
        );
    }

    render() {
        return (
            <>
                <ListGroup variant="flush">
                    <ListGroup.Item className="p-1 mt-1 list-title text-uppercase">Brands</ListGroup.Item>
                    {this.props.brands.map(this.createBrand) }
                    <ListGroup.Item className="p-1 mt-5 list-title text-uppercase">Categorie</ListGroup.Item>
                    {this.props.categories.map(this.createCategory) }
                </ListGroup>
            </>
        );
    }
}

export default Filters;
