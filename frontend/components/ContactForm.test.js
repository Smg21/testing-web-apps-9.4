import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render(<ContactForm />);
});

test('renders the contact form header', () => {
    render(<ContactForm />);
    const header = screen.queryByText(/contact form/i);
    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);
    const firstNameInput = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstNameInput, 'sam');

    const error = await screen.findAllByTestId('error');
    expect(error).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />);
    const firstNameInput = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstNameInput, ' ');
    const lastNameInput = screen.getByLabelText(/Last Name*/i);
    userEvent.type(lastNameInput, '');
    const emailInput = screen.getByLabelText(/Email*/i);
    userEvent.type(emailInput, ' ');

    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);
    
    const error = await screen.findAllByTestId('error');
    expect(error).toHaveLength(3);

});
    

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />);
    const firstNameInput = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstNameInput, 'Samantha');
    const lastNameInput = screen.getByLabelText(/Last Name*/i);
    userEvent.type(lastNameInput, 'Smithson');
    const emailInput = screen.getByLabelText(/Email*/i);
    userEvent.type(emailInput, ' ');

    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);
    
    const error = await screen.findAllByTestId('error');
    expect(error).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />);
    const firstNameInput = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstNameInput, 'Samantha');
    const lastNameInput = screen.getByLabelText(/Last Name*/i);
    userEvent.type(lastNameInput, 'Smithson');
    const emailInput = screen.getByLabelText(/Email*/i);
    userEvent.type(emailInput, 'sophie');

    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);
    
    const error = await screen.findAllByTestId('error');
    expect(error).toHaveLength(1);

    const page = screen.queryByText(/error/i);
    expect(page).toBeInTheDocument();
    expect(page).toHaveTextContent(/email must be a valid email address/i);

});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />);
    const firstNameInput = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstNameInput, 'Samantha');
    const lastNameInput = screen.getByLabelText(/Last Name*/i);
    userEvent.type(lastNameInput, '');
    const emailInput = screen.getByLabelText(/Email*/i);
    userEvent.type(emailInput, 'sophie@gmail.com');

    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);
    
    const error = await screen.findAllByTestId('error');
    expect(error).toHaveLength(1);

    const page = screen.queryByText(/error/i);
    expect(page).toBeInTheDocument();
    expect(page).toHaveTextContent(/lastName is a required field/i);
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />);
    const firstNameInput = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstNameInput, 'Sarah');
    const lastNameInput = screen.getByLabelText(/Last Name*/i);
    userEvent.type(lastNameInput, 'Burkson');
    const emailInput = screen.getByLabelText(/Email*/i);
    userEvent.type(emailInput, 'srhbrksn@gmail.com');
    const messageInput = screen.getByLabelText(/Message/i);
    userEvent.type(messageInput, '');

    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);
    
    await waitFor(() => {
        const message = screen.queryByText(/message:/i);
        expect(message).not.toBeInTheDocument()
     }, {timeout: 4000})
  


});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />);
    const firstNameInput = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstNameInput, 'Micky');
    const lastNameInput = screen.getByLabelText(/Last Name*/i);
    userEvent.type(lastNameInput, 'Johnson');
    const emailInput = screen.getByLabelText(/Email*/i);
    userEvent.type(emailInput, 'MickJohn@gmail.com');
    const messageInput = screen.getByLabelText(/Message/i);
    userEvent.type(messageInput, 'This my message');

    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);
    
    await waitFor(() => {
        const message = screen.queryByText(/message:/i);
        expect(message).toBeInTheDocument()
     }, {timeout: 4000})

     await waitFor(() => {
        const fName = screen.queryByText(/First Name:/i);
        expect(fName).toBeInTheDocument()
     }, {timeout: 4000})

     await waitFor(() => {
        const lName = screen.queryByText(/Last Name:/i);
        expect(lName).toBeInTheDocument()
     }, {timeout: 4000})

     await waitFor(() => {
        const emaill = screen.queryByText(/Email:/i);
        expect(emaill).toBeInTheDocument()
     }, {timeout: 4000})
});
