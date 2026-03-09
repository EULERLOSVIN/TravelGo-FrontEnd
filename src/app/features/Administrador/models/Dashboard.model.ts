export interface DailyMetricsModel {
    todayIncome: number;
    yesterdayIncome: number;
    incomeTrendPercentage: number;
    todayTicketsSold: number;
    yesterdayTicketsSold: number;
    ticketsTrendPercentage: number;
    occupancyRate: number;
    totalVehiclesInRoute: number;
    totalVehiclesInQueue: number;
}

export interface RouteProfitabilityModel {
    routeName: string;
    totalIncome: number;
    percentageOfTotal: number;
}

export interface HourlyDemandModel {
    hour: string;
    ticketsSold: number;
}

export interface UpcomingDepartureModel {
    hour: string;
    routeName: string;
    driverName: string;
    plateNumber: string;
    occupancyPercentage: number;
    status: string;
}

export interface ActiveAlertModel {
    type: string;
    description: string;
    severity: string;
}

export interface RecentActivityModel {
    description: string;
    timeAgo: string;
    type: string;
    date: string;
}

export interface SalesChannelModel {
    channelName: string;
    count: number;
    percentage: number;
}

export interface DashboardModel {
    dailyMetrics: DailyMetricsModel;
    topRoutes: RouteProfitabilityModel[];
    hourlyDemand: HourlyDemandModel[];
    upcomingDepartures: UpcomingDepartureModel[];
    activeAlerts: ActiveAlertModel[];
    recentActivity: RecentActivityModel[];
    salesByChannel: SalesChannelModel[];
}
