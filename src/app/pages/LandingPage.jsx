import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, BarChart3, Shield, Zap, Users, CreditCard, TrendingUp } from 'lucide-react';
import Aurora from '../components/Aurora';

export function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-[#5B2DFF] to-[#8C6CFF] bg-clip-text text-transparent">
                        CrediFlow
                    </h1>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                        <a href="#features" className="hover:text-[#5B2DFF] transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-[#5B2DFF] transition-colors">How it Works</a>
                        <a href="#roles" className="hover:text-[#5B2DFF] transition-colors">Roles</a>
                        <a href="#stats" className="hover:text-[#5B2DFF] transition-colors">Stats</a>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="px-5 py-2 text-sm font-semibold text-[#5B2DFF] hover:bg-[#F3F0FF] transition-colors">
                            Sign In
                        </Link>
                        <Link to="/register" className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#5B2DFF] to-[#3A1FBF] hover:opacity-90 transition-opacity">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                {/* Aurora Background */}
                <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                    <Aurora
                        colorStops={["#1134e4", "#4918ec", "#5227FF"]}
                        blend={0.5}
                        amplitude={1.0}
                        speed={1}
                    />
                </div>
                <div className="max-w-7xl mx-auto relative" style={{ zIndex: 1 }}>
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-block px-4 py-1.5 bg-[#F3F0FF] text-[#5B2DFF] text-sm font-semibold rounded-full mb-6">
                            Trusted by 10,000+ users worldwide
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                            Complete Loan
                            <span className="bg-gradient-to-r from-[#5B2DFF] to-[#8C6CFF] bg-clip-text text-transparent"> Lifecycle </span>
                            Management
                        </h1>
                        <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                            Streamline lending operations with real-time analytics, automated workflows, and bank-grade security. Built for borrowers, lenders, and financial institutions.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/register"
                                className="px-8 py-3.5 text-white font-semibold bg-gradient-to-r from-[#5B2DFF] to-[#3A1FBF] hover:opacity-90 transition-opacity flex items-center gap-2 text-lg shadow-lg shadow-[#5B2DFF]/25"
                            >
                                Start Free Trial
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                to="/login"
                                className="px-8 py-3.5 font-semibold text-gray-700 border-2 border-gray-300 hover:border-[#5B2DFF] hover:text-[#5B2DFF] transition-colors text-lg"
                            >
                                View Demo
                            </Link>
                        </div>
                    </div>

                    {/* Hero Visual */}
                    <div className="mt-16 max-w-5xl mx-auto">
                        <div className="bg-gradient-to-br from-[#5B2DFF] to-[#3A1FBF] rounded-2xl p-8 md:p-12 shadow-2xl shadow-[#5B2DFF]/20">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-white">
                                    <p className="text-3xl font-bold mb-1">$2.4M</p>
                                    <p className="text-purple-200 text-sm">Total Loans Processed</p>
                                    <div className="mt-4 flex gap-1">
                                        {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
                                            <div key={i} className="flex-1 bg-white/20 rounded-full" style={{ height: `${h}px` }}>
                                                <div className="bg-white/60 rounded-full w-full" style={{ height: `${h * 0.7}px`, marginTop: `${h * 0.3}px` }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-white">
                                    <p className="text-3xl font-bold mb-1">98.5%</p>
                                    <p className="text-purple-200 text-sm">Approval Rate</p>
                                    <div className="mt-4 h-24 flex items-end gap-1">
                                        {[30, 45, 55, 40, 65, 75, 85, 60, 90, 95].map((h, i) => (
                                            <div key={i} className="flex-1 bg-gradient-to-t from-white/60 to-white/20 rounded-t" style={{ height: `${h}%` }} />
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-white">
                                    <p className="text-3xl font-bold mb-1">24hrs</p>
                                    <p className="text-purple-200 text-sm">Avg. Processing Time</p>
                                    <div className="mt-4 space-y-2">
                                        {['Application', 'Review', 'Approval', 'Disbursement'].map((step, i) => (
                                            <div key={step} className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${i < 3 ? 'bg-green-400' : 'bg-yellow-400'}`} />
                                                <span className="text-sm text-purple-100">{step}</span>
                                                <div className="flex-1 h-1 bg-white/10 rounded-full ml-auto">
                                                    <div className="h-full bg-white/40 rounded-full" style={{ width: `${85 - i * 15}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-6 bg-[#FAFAFA]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            A comprehensive platform designed for every stakeholder in the lending ecosystem
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: BarChart3, title: 'Real-time Analytics', desc: 'Live dashboards with actionable insights into loan portfolios, risk metrics, and financial performance.', color: '#5B2DFF' },
                            { icon: Shield, title: 'Bank-grade Security', desc: 'End-to-end encryption, two-factor authentication, and compliance with industry security standards.', color: '#059669' },
                            { icon: Zap, title: 'Fast Processing', desc: 'Automated workflows reduce processing time from weeks to hours with intelligent document verification.', color: '#D97706' },
                            { icon: Users, title: 'Multi-role Access', desc: 'Tailored dashboards for borrowers, lenders, analysts, and administrators with role-based permissions.', color: '#DC2626' },
                            { icon: CreditCard, title: 'Payment Management', desc: 'Automated EMI calculations, payment scheduling, and real-time transaction tracking for all parties.', color: '#2563EB' },
                            { icon: TrendingUp, title: 'Revenue Intelligence', desc: 'Predictive analytics for default risk assessment, revenue forecasting, and portfolio optimization.', color: '#7C3AED' },
                        ].map((feature) => (
                            <div key={feature.title} className="bg-white border border-gray-200 p-8 hover:shadow-lg hover:border-gray-300 transition-all group">
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-5"
                                    style={{ backgroundColor: `${feature.color}15` }}
                                >
                                    <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#5B2DFF] transition-colors">{feature.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Get started in minutes with our simple process</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { step: '01', title: 'Create Account', desc: 'Sign up and choose your role — borrower, lender, or analyst' },
                            { step: '02', title: 'Set Up Profile', desc: 'Complete your financial profile and verify your identity' },
                            { step: '03', title: 'Start Operations', desc: 'Apply for loans, create offers, or begin monitoring analytics' },
                            { step: '04', title: 'Track & Grow', desc: 'Monitor performance in real-time and optimize your strategy' },
                        ].map((item, i) => (
                            <div key={item.step} className="text-center relative">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#5B2DFF] to-[#8C6CFF] text-white font-bold text-xl flex items-center justify-center rounded-full">
                                    {item.step}
                                </div>
                                {i < 3 && (
                                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[#5B2DFF]/30 to-transparent" />
                                )}
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Roles Section */}
            <section id="roles" className="py-20 px-6 bg-[#FAFAFA]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Built for Every Role</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Specialized tools and dashboards tailored to each user's needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { role: 'Borrower', desc: 'Apply for loans, track EMI schedules, manage payments, and monitor your credit journey all in one place.', features: ['Loan Applications', 'EMI Calculator', 'Payment History', 'Credit Score Tracking'] },
                            { role: 'Lender', desc: 'Create loan offers, review applications, manage repayments, and maximize returns with data-driven insights.', features: ['Create Offers', 'Application Review', 'Repayment Tracking', 'Earnings Dashboard'] },
                            { role: 'Analyst', desc: 'Monitor platform performance, generate reports, assess risk, and provide data-driven recommendations.', features: ['Performance Reports', 'Default Monitoring', 'Revenue Trends', 'Risk Analysis'] },
                            { role: 'Admin', desc: 'Full platform oversight with user management, loan monitoring, transaction review, and system analytics.', features: ['User Management', 'Loan Monitoring', 'Transaction Review', 'System Analytics'] },
                        ].map((item) => (
                            <div key={item.role} className="bg-white border border-gray-200 p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.role}</h3>
                                <p className="text-gray-600 text-sm mb-5">{item.desc}</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {item.features.map((f) => (
                                        <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                                            <CheckCircle className="w-4 h-4 text-[#5B2DFF] flex-shrink-0" />
                                            {f}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section id="stats" className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-gradient-to-r from-[#5B2DFF] to-[#3A1FBF] rounded-2xl p-12 md:p-16">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Trusted by Thousands</h2>
                            <p className="text-purple-200 text-lg">Our platform powers lending operations across the globe</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { value: '10K+', label: 'Active Users' },
                                { value: '$50M+', label: 'Loans Processed' },
                                { value: '99.9%', label: 'Uptime' },
                                { value: '4.9/5', label: 'User Rating' },
                            ].map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <p className="text-4xl md:text-5xl font-extrabold text-white mb-2">{stat.value}</p>
                                    <p className="text-purple-200 font-medium">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-[#FAFAFA]">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Join thousands of users who trust CrediFlow for their lending needs. Start your free trial today.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/register"
                            className="px-8 py-3.5 text-white font-semibold bg-gradient-to-r from-[#5B2DFF] to-[#3A1FBF] hover:opacity-90 transition-opacity flex items-center gap-2 text-lg shadow-lg shadow-[#5B2DFF]/25"
                        >
                            Create Free Account
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-3.5 font-semibold text-gray-700 border-2 border-gray-300 hover:border-[#5B2DFF] hover:text-[#5B2DFF] transition-colors text-lg"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6 border-t border-gray-200">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">© 2026 CrediFlow. All rights reserved.</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                        <a href="#" className="hover:text-[#5B2DFF]">Privacy Policy</a>
                        <a href="#" className="hover:text-[#5B2DFF]">Terms of Service</a>
                        <a href="#" className="hover:text-[#5B2DFF]">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
