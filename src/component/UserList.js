import React, { useState, useEffect, useCallback } from 'react';
import { Search, Users, Filter, RefreshCw, Eye, EyeOff, RotateCcw } from 'lucide-react';
import axios from 'axios';
import "../css/UserList.css";
import HeaderComponent from "./HeaderComponent";
import FooterComponent from "./FooterComponent";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({
        name: '',
        role: '',
        status: '',
        softDelete: '',
        createdAt: ''
    });
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // Mock token check (replace with actual auth logic, e.g., checking token in localStorage)
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    const API_BASE_URL = 'http://localhost:8080/api/admin/users'; // Adjust to your backend URL

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const params = {
                page,
                size: 10,
                name: filters.name || undefined,
                role: filters.role || undefined,
                status: filters.status !== '' ? filters.status === 'true' : undefined,
                softDelete: filters.softDelete !== '' ? filters.softDelete === 'true' : undefined,
                createdAt: filters.createdAt ? `${filters.createdAt}T00:00:00` : undefined
            };

            console.log('Sending request with params:', params); // Debug log

            const response = await axios.get(API_BASE_URL, {
                params,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            console.log('Received response:', response.data); // Debug log

            const { content, totalPages, totalElements } = response.data;
            setUsers(content);
            setTotalPages(totalPages);
            setTotalElements(totalElements);
        } catch (error) {
            console.error('Error fetching users:', error.response || error); // Detailed error log
            if (error.response?.status === 401 || error.response?.status === 403) {
                setIsAuthenticated(false);
                setError('Phiên đăng nhập hết hạn hoặc không có quyền truy cập');
            } else if (error.response?.status === 400) {
                setError(error.response.data || 'Dữ liệu lọc không hợp lệ');
            } else {
                setError('Lỗi khi lấy danh sách người dùng: ' + (error.response?.data || error.message));
            }
        } finally {
            setLoading(false);
        }
    }, [filters, page]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchUsers();
        }
    }, [fetchUsers, isAuthenticated]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = () => {
        setPage(0);
        fetchUsers();
    };

    const handleClearFilters = () => {
        setFilters({
            name: '',
            role: '',
            status: '',
            softDelete: '',
            createdAt: ''
        });
        setPage(0);
    };

    const handleToggleStatus = async (id) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/${id}/toggle-status`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === id ? response.data : user
                )
            );
        } catch (error) {
            console.error('Error toggling status:', error);
            setError('Lỗi khi chuyển đổi trạng thái');
        }
    };

    const handleRestore = async (id) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/${id}/restore`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === id ? response.data : user
                )
            );
        } catch (error) {
            console.error('Error restoring user:', error);
            setError('Lỗi khi khôi phục người dùng');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'N/A';
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            };
            return date.toLocaleDateString('vi-VN', options);
        } catch {
            return 'N/A';
        }
    };

    const getStatusBadge = (status) => {
        return status ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <Eye className="w-3 h-3 mr-1" />
                Kích hoạt
            </span>
        ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <EyeOff className="w-3 h-3 mr-1" />
                Khóa
            </span>
        );
    };

    const getRoleBadge = (role) => {
        return role === 'ADMIN' ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Admin
            </span>
        ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                User
            </span>
        );
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Truy cập bị từ chối</h2>
                    <p className="text-gray-600">Vui lòng đăng nhập để tiếp tục</p>
                </div>
            </div>
        );
    }

    return (
        <>
        <HeaderComponent/>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                    <Users className="w-8 h-8 mr-3 text-blue-600" />
                                    Quản lý người dùng
                                </h1>
                                <p className="mt-2 text-gray-600">Quản lý và theo dõi tất cả người dùng trong hệ thống</p>
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    {showFilters && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên người dùng</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Nhập tên..."
                                        value={filters.name}
                                        onChange={handleFilterChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                                    <select
                                        name="role"
                                        value={filters.role}
                                        onChange={handleFilterChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Tất cả vai trò</option>
                                        <option value="ADMIN">Admin</option>
                                        <option value="USER">User</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                                    <select
                                        name="status"
                                        value={filters.status}
                                        onChange={handleFilterChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Tất cả trạng thái</option>
                                        <option value="true">Kích hoạt</option>
                                        <option value="false">Khóa</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái xóa</label>
                                    <select
                                        name="softDelete"
                                        value={filters.softDelete}
                                        onChange={handleFilterChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Tất cả</option>
                                        <option value="true">Đã xóa</option>
                                        <option value="false">Chưa xóa</option>
                                    </select>
                                </div>

                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleClearFilters}
                                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Xóa bộ lọc
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        {loading && (
                            <div className="flex items-center justify-center py-12">
                                <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-3" />
                                <span className="text-gray-600">Đang tải dữ liệu...</span>
                            </div>
                        )}

                        {error && (
                            <div className="p-4 bg-red-50 border-l-4 border-red-400">
                                <p className="text-red-800">{error}</p>
                            </div>
                        )}

                        {!loading && !error && users.length === 0 && (
                            <div className="text-center py-12">
                                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">Không tìm thấy người dùng nào phù hợp với bộ lọc</p>
                            </div>
                        )}

                        {users.length > 0 && (
                            <>
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <p className="text-sm text-gray-700">
                                        Hiển thị <span className="font-medium">{(page * 10) + 1}</span> đến{' '}
                                        <span className="font-medium">{Math.min((page + 1) * 10, totalElements)}</span> trong tổng số{' '}
                                        <span className="font-medium">{totalElements}</span> người dùng
                                    </p>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                STT
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tên người dùng
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Vai trò
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Trạng thái
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Xóa mềm
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Hành động
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map((user, index) => (
                                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {page * 10 + index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    #{user.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getRoleBadge(user.role)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(user.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {user.softDelete ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            Đã xóa
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            Bình thường
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleToggleStatus(user.id)}
                                                            className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                                                                user.status
                                                                    ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                                                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                                                            }`}
                                                        >
                                                            {user.status ? (
                                                                <>
                                                                    <EyeOff className="w-3 h-3 mr-1" />
                                                                    Khóa
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Eye className="w-3 h-3 mr-1" />
                                                                    Kích hoạt
                                                                </>
                                                            )}
                                                        </button>
                                                        {user.softDelete && (
                                                            <button
                                                                onClick={() => handleRestore(user.id)}
                                                                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-md hover:bg-blue-200 transition-colors"
                                                            >
                                                                <RotateCcw className="w-3 h-3 mr-1" />
                                                                Khôi phục
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                                    <button
                                        onClick={() => setPage(page - 1)}
                                        disabled={page === 0}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Trang trước
                                    </button>

                                    <span className="text-sm text-gray-700">
                                    Trang <span className="font-medium">{page + 1}</span> /{' '}
                                        <span className="font-medium">{totalPages}</span>
                                </span>

                                    <button
                                        onClick={() => setPage(page + 1)}
                                        disabled={page >= totalPages - 1}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Trang sau
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <FooterComponent/>
        </>
    );
};

export default UserList;