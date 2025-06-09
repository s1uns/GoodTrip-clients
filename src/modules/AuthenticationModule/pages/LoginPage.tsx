import styled from "@emotion/styled";
import LoginForm from "../components/Login/LoginForm";

const LoginPage = () => {
	return (
		<PageContainer>
			<LoginForm />
		</PageContainer>
	);
};

export default LoginPage;

const PageContainer = styled.div`
	display: flex;
	width: 100%;
	height: 100vh;
	justify-content: center;
	align-items: center;
	flex-shrink: 0;
	background-color: white;
`;
