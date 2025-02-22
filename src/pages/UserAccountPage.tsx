// UserAccountPage.tsx
import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Paper,
    Avatar,
    Grid,
    TextField,
    Button,
    Box,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store.ts";
import { fetchUserAccount } from "../reducers/user-slice.ts";
import { Employee } from "../model/employee.ts";

interface PasswordChange {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

// Styled components
const ProfilePaper = styled(Paper)(({ theme }) => ({
    borderRadius: 16,
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    marginTop: -28,
    padding: theme.spacing(2),
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
    width: theme.spacing(20),
    height: theme.spacing(20),
    margin: '0 auto',
    border: `4px solid ${theme.palette.background.paper}`,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontWeight: 600,
    marginBottom: theme.spacing(2),
}));

const UserAccountPage: React.FC = () => {
    const { userDetail, loading, error } = useSelector((state: RootState) => state.user);
    const username = useSelector((state: RootState) => state.user.username);
    const dispatch = useDispatch<AppDispatch>();

    const [user, setUser] = useState<Employee | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [passwordData, setPasswordData] = useState<PasswordChange>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        console.log(username);
        if (username) {
            dispatch(fetchUserAccount(username));
        }
    }, [dispatch, username]);

    useEffect(() => {
        console.log("User Detail:", userDetail);
        console.log("Username:", username);
    }, [userDetail, username]);

    useEffect(() => {
        if (userDetail) {
            setUser({
                id: userDetail.id,
                name: userDetail.name,
                role: userDetail.role,
                shiftSchedule: userDetail.shiftSchedule,
                gender: userDetail.gender,
                email: userDetail.email,
                mobile: userDetail.mobile,
                createdAt: userDetail.createdAt,
                updatedAt: userDetail.updatedAt,
                warehouseId: userDetail.warehouseId,
            });
        }
    }, [userDetail]);

    const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUser((prev) => prev ? ({
            ...prev,
            [name]: value,
        }) : null);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleProfileSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setIsEditing(false);
        // Here you would typically dispatch an update action
        console.log('Updated user:', user);
    };

    const handlePasswordSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('New passwords do not match');
            return;
        }
        // Here you would dispatch a password update action
        console.log('Password change request:', passwordData);
        setOpenPasswordDialog(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    if (loading) {
        return (
            <Container maxWidth="md">
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md">
                <Typography color="error" align="center" sx={{ mt: 10 }}>
                    {error}
                </Typography>
            </Container>
        );
    }

    if (!user) return null;

    return (
        <Container maxWidth="md">
            <ProfilePaper elevation={0}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <ProfileAvatar src="src/assets/avatar.png" alt={user.name}>
                        <AccountCircleIcon sx={{ fontSize: 80 }} />
                    </ProfileAvatar>
                    <Typography variant="h4" sx={{ mt: 2, fontWeight: 600 }}>
                        {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {user.email} | {user.role}
                    </Typography>
                </Box>

                <form onSubmit={handleProfileSubmit}>
                    <SectionTitle variant="h6">Personal Information</SectionTitle>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={user.name}
                                onChange={handleProfileChange}
                                disabled={!isEditing}
                                variant="outlined"
                                InputProps={{ sx: { borderRadius: 2 } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Mobile"
                                name="mobile"
                                value={user.mobile}
                                onChange={handleProfileChange}
                                disabled={!isEditing}
                                variant="outlined"
                                InputProps={{ sx: { borderRadius: 2 } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={user.email}
                                onChange={handleProfileChange}
                                disabled={!isEditing}
                                variant="outlined"
                                InputProps={{ sx: { borderRadius: 2, marginBottom: 3 } }}
                            />
                        </Grid>
                    </Grid>

                    <SectionTitle variant="h6" sx={{ mt: 4 }}>Work Information</SectionTitle>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Role"
                                name="role"
                                value={user.role}
                                disabled
                                variant="outlined"
                                InputProps={{ sx: { borderRadius: 2 } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Shift Schedule"
                                name="shiftSchedule"
                                value={user.shiftSchedule}
                                disabled
                                variant="outlined"
                                InputProps={{ sx: { borderRadius: 2 } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Warehouse ID"
                                name="warehouseId"
                                value={user.warehouseId}
                                disabled
                                variant="outlined"
                                InputProps={{ sx: { borderRadius: 2 } }}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                        <Button
                            variant="outlined"
                            startIcon={<LockIcon />}
                            onClick={() => setOpenPasswordDialog(true)}
                            sx={{ borderRadius: 2 }}
                        >
                            Change Password
                        </Button>
                        <Box>
                            {isEditing ? (
                                <>
                                    <Button
                                        variant="outlined"
                                        onClick={handleEditToggle}
                                        sx={{ mr: 2, borderRadius: 2 }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{ borderRadius: 2, px: 3 }}
                                    >
                                        Save Changes
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={handleEditToggle}
                                    sx={{ borderRadius: 2, px: 3 }}
                                >
                                    Edit Profile
                                </Button>
                            )}
                        </Box>
                    </Box>
                </form>
            </ProfilePaper>

            <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
                <DialogTitle>Change Password</DialogTitle>
                <form onSubmit={handlePasswordSubmit}>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Current Password"
                            name="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            margin="normal"
                            variant="outlined"
                            InputProps={{ sx: { borderRadius: 2 } }}
                        />
                        <TextField
                            fullWidth
                            label="New Password"
                            name="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            margin="normal"
                            variant="outlined"
                            InputProps={{ sx: { borderRadius: 2 } }}
                        />
                        <TextField
                            fullWidth
                            label="Confirm New Password"
                            name="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            margin="normal"
                            variant="outlined"
                            InputProps={{ sx: { borderRadius: 2 } }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
                        <Button type="submit" variant="contained" sx={{ borderRadius: 2 }}>
                            Update Password
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Container>
    );
};

export default UserAccountPage;