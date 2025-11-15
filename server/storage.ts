import { randomUUID } from "crypto";
import type {
  Driver,
  InsertDriver,
  Trip,
  InsertTrip,
  Scorecard,
  InsertScorecard,
  Badge,
  InsertBadge,
  DriverBadge,
  InsertDriverBadge,
  Voucher,
  InsertVoucher,
  Redemption,
  InsertRedemption,
  NearbyPlace,
  InsertNearbyPlace,
  CommunityPost,
  InsertCommunityPost,
  WellnessTip,
  InsertWellnessTip,
  Route,
  InsertRoute,
  SupportResource,
  InsertSupportResource,
  FatigueCheckIn,
  InsertFatigueCheckIn,
  RoadAlert,
  InsertRoadAlert,
  LearningVideo,
  InsertLearningVideo,
  VideoCompletion,
  InsertVideoCompletion,
  ChecklistTemplate,
  InsertChecklistTemplate,
  ChecklistCompletion,
  InsertChecklistCompletion,
  UpcomingTrip,
  InsertUpcomingTrip,
  DeliveryPoint,
  InsertDeliveryPoint,
} from "@shared/schema";

export interface IStorage {
  // Drivers
  getDriver(id: string): Promise<Driver | undefined>;
  getDriverByPhoneNumber(phoneNumber: string): Promise<Driver | undefined>;
  createDriver(driver: InsertDriver): Promise<Driver>;
  updateDriver(id: string, updates: Partial<Driver>): Promise<Driver | undefined>;
  getAllDrivers(): Promise<Driver[]>;

  // Trips
  createTrip(trip: InsertTrip): Promise<Trip>;
  getTrip(id: string): Promise<Trip | undefined>;
  getTripsByDriver(driverId: string): Promise<Trip[]>;
  updateTrip(id: string, updates: Partial<Trip>): Promise<Trip | undefined>;

  // Scorecards
  createScorecard(scorecard: InsertScorecard): Promise<Scorecard>;
  getScorecardsByDriver(driverId: string): Promise<Scorecard[]>;
  getLatestScorecardByDriver(driverId: string): Promise<Scorecard | undefined>;

  // Badges
  getAllBadges(): Promise<Badge[]>;
  getBadge(id: string): Promise<Badge | undefined>;
  createBadge(badge: InsertBadge): Promise<Badge>;
  getDriverBadges(driverId: string): Promise<(DriverBadge & { badge: Badge })[]>;
  awardBadge(driverBadge: InsertDriverBadge): Promise<DriverBadge>;

  // Vouchers & Redemptions
  getAllVouchers(): Promise<Voucher[]>;
  getVoucher(id: string): Promise<Voucher | undefined>;
  createVoucher(voucher: InsertVoucher): Promise<Voucher>;
  redeemVoucher(redemption: InsertRedemption): Promise<Redemption>;
  getRedemptionsByDriver(driverId: string): Promise<(Redemption & { voucher: Voucher })[]>;

  // Nearby Places
  getAllNearbyPlaces(): Promise<NearbyPlace[]>;
  getNearbyPlacesByCategory(category: string): Promise<NearbyPlace[]>;
  createNearbyPlace(place: InsertNearbyPlace): Promise<NearbyPlace>;

  // Community Posts
  getAllCommunityPosts(): Promise<(CommunityPost & { driver: Driver })[]>;
  getCommunityPost(id: string): Promise<CommunityPost | undefined>;
  createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost>;
  updateCommunityPostLikes(id: string, increment: number): Promise<void>;

  // Wellness Tips
  getAllWellnessTips(): Promise<WellnessTip[]>;
  createWellnessTip(tip: InsertWellnessTip): Promise<WellnessTip>;

  // Routes
  createRoute(route: InsertRoute): Promise<Route>;
  getRoute(id: string): Promise<Route | undefined>;
  getRoutesByDriver(driverId: string): Promise<Route[]>;

  // Support Resources
  getAllSupportResources(): Promise<SupportResource[]>;
  getSupportResourcesByCategory(category: string): Promise<SupportResource[]>;
  createSupportResource(resource: InsertSupportResource): Promise<SupportResource>;

  // Fatigue Check-Ins
  createFatigueCheckIn(checkIn: InsertFatigueCheckIn): Promise<FatigueCheckIn>;
  getFatigueCheckInsByDriver(driverId: string): Promise<FatigueCheckIn[]>;
  getLatestFatigueCheckIn(driverId: string): Promise<FatigueCheckIn | undefined>;

  // Road Alerts
  getActiveRoadAlerts(): Promise<RoadAlert[]>;
  getRoadAlert(id: string): Promise<RoadAlert | undefined>;
  createRoadAlert(alert: InsertRoadAlert): Promise<RoadAlert>;
  updateRoadAlert(id: string, updates: Partial<RoadAlert>): Promise<RoadAlert | undefined>;

  // Learning Videos
  getAllLearningVideos(): Promise<LearningVideo[]>;
  getLearningVideosByCategory(category: string): Promise<LearningVideo[]>;
  getLearningVideo(id: string): Promise<LearningVideo | undefined>;
  createLearningVideo(video: InsertLearningVideo): Promise<LearningVideo>;
  completeVideo(completion: InsertVideoCompletion): Promise<VideoCompletion>;
  getCompletedVideos(driverId: string): Promise<(VideoCompletion & { video: LearningVideo })[]>;

  // Checklists
  getAllChecklistTemplates(): Promise<ChecklistTemplate[]>;
  getChecklistTemplateByType(checklistType: string): Promise<ChecklistTemplate | undefined>;
  createChecklistTemplate(template: InsertChecklistTemplate): Promise<ChecklistTemplate>;
  completeChecklist(completion: InsertChecklistCompletion): Promise<ChecklistCompletion>;
  getChecklistCompletionsByDriver(driverId: string): Promise<ChecklistCompletion[]>;
  getChecklistCompletionsByTrip(tripId: string): Promise<ChecklistCompletion[]>;

  // Upcoming Trips
  createUpcomingTrip(trip: InsertUpcomingTrip): Promise<UpcomingTrip>;
  getUpcomingTrip(id: string): Promise<UpcomingTrip | undefined>;
  getUpcomingTripsByDriver(driverId: string): Promise<UpcomingTrip[]>;
  updateUpcomingTrip(id: string, updates: Partial<UpcomingTrip>): Promise<UpcomingTrip | undefined>;

  // Delivery Points
  createDeliveryPoint(point: InsertDeliveryPoint): Promise<DeliveryPoint>;
  getAllDeliveryPoints(): Promise<DeliveryPoint[]>;
  getDeliveryPointsByTrip(tripId: string): Promise<DeliveryPoint[]>;
  updateDeliveryPoint(id: string, updates: Partial<DeliveryPoint>): Promise<DeliveryPoint | undefined>;
}

export class MemStorage implements IStorage {
  private drivers: Map<string, Driver>;
  private trips: Map<string, Trip>;
  private scorecards: Map<string, Scorecard>;
  private badges: Map<string, Badge>;
  private driverBadges: Map<string, DriverBadge>;
  private vouchers: Map<string, Voucher>;
  private redemptions: Map<string, Redemption>;
  private nearbyPlaces: Map<string, NearbyPlace>;
  private communityPosts: Map<string, CommunityPost>;
  private wellnessTips: Map<string, WellnessTip>;
  private routes: Map<string, Route>;
  private supportResources: Map<string, SupportResource>;
  private fatigueCheckIns: Map<string, FatigueCheckIn>;
  private roadAlerts: Map<string, RoadAlert>;
  private learningVideos: Map<string, LearningVideo>;
  private videoCompletions: Map<string, VideoCompletion>;
  private checklistTemplates: Map<string, ChecklistTemplate>;
  private checklistCompletions: Map<string, ChecklistCompletion>;
  private upcomingTrips: Map<string, UpcomingTrip>;
  private deliveryPoints: Map<string, DeliveryPoint>;

  constructor() {
    this.drivers = new Map();
    this.trips = new Map();
    this.scorecards = new Map();
    this.badges = new Map();
    this.driverBadges = new Map();
    this.vouchers = new Map();
    this.redemptions = new Map();
    this.nearbyPlaces = new Map();
    this.communityPosts = new Map();
    this.wellnessTips = new Map();
    this.routes = new Map();
    this.supportResources = new Map();
    this.fatigueCheckIns = new Map();
    this.roadAlerts = new Map();
    this.learningVideos = new Map();
    this.videoCompletions = new Map();
    this.checklistTemplates = new Map();
    this.checklistCompletions = new Map();
    this.upcomingTrips = new Map();
    this.deliveryPoints = new Map();
    this.seedData();
  }

  // Drivers
  async getDriver(id: string): Promise<Driver | undefined> {
    return this.drivers.get(id);
  }

  async getDriverByPhoneNumber(phoneNumber: string): Promise<Driver | undefined> {
    return Array.from(this.drivers.values()).find((d) => d.phoneNumber === phoneNumber);
  }

  async createDriver(insertDriver: InsertDriver): Promise<Driver> {
    const id = randomUUID();
    const driver: Driver = {
      ...insertDriver,
      id,
      avatarUrl: insertDriver.avatarUrl ?? null,
      level: insertDriver.level || "Rookie",
      totalPoints: insertDriver.totalPoints || 0,
      currentStreak: insertDriver.currentStreak || 0,
      totalTrips: insertDriver.totalTrips || 0,
      createdAt: new Date(),
    };
    this.drivers.set(id, driver);
    return driver;
  }

  async updateDriver(id: string, updates: Partial<Driver>): Promise<Driver | undefined> {
    const driver = this.drivers.get(id);
    if (!driver) return undefined;
    const updated = { ...driver, ...updates };
    this.drivers.set(id, updated);
    return updated;
  }

  async getAllDrivers(): Promise<Driver[]> {
    return Array.from(this.drivers.values());
  }

  // Trips
  async createTrip(insertTrip: InsertTrip): Promise<Trip> {
    const id = randomUUID();
    const trip: Trip = {
      ...insertTrip,
      id,
      upcomingTripId: insertTrip.upcomingTripId || null,
      waypoints: insertTrip.waypoints || [],
      status: insertTrip.status || "active",
      fuelEfficiency: insertTrip.fuelEfficiency || null,
      harshBraking: insertTrip.harshBraking || 0,
      routeAdherence: insertTrip.routeAdherence || null,
      idleTime: insertTrip.idleTime || 0,
      grade: insertTrip.grade || null,
      pointsEarned: insertTrip.pointsEarned || 0,
      badgesEarned: insertTrip.badgesEarned || [],
      endTime: insertTrip.endTime || null,
    };
    this.trips.set(id, trip);
    return trip;
  }

  async getTrip(id: string): Promise<Trip | undefined> {
    return this.trips.get(id);
  }

  async getTripsByDriver(driverId: string): Promise<Trip[]> {
    return Array.from(this.trips.values()).filter((t) => t.driverId === driverId);
  }

  async updateTrip(id: string, updates: Partial<Trip>): Promise<Trip | undefined> {
    const trip = this.trips.get(id);
    if (!trip) return undefined;
    const updated = { ...trip, ...updates };
    this.trips.set(id, updated);
    return updated;
  }

  // Scorecards
  async createScorecard(insertScorecard: InsertScorecard): Promise<Scorecard> {
    const id = randomUUID();
    const scorecard: Scorecard = {
      ...insertScorecard,
      id,
      aiTips: insertScorecard.aiTips || [],
      tripId: insertScorecard.tripId || null,
    };
    this.scorecards.set(id, scorecard);
    return scorecard;
  }

  async getScorecardsByDriver(driverId: string): Promise<Scorecard[]> {
    return Array.from(this.scorecards.values()).filter((s) => s.driverId === driverId);
  }

  async getLatestScorecardByDriver(driverId: string): Promise<Scorecard | undefined> {
    const scorecards = await this.getScorecardsByDriver(driverId);
    return scorecards.sort((a, b) => b.date.getTime() - a.date.getTime())[0];
  }

  // Badges
  async getAllBadges(): Promise<Badge[]> {
    return Array.from(this.badges.values());
  }

  async getBadge(id: string): Promise<Badge | undefined> {
    return this.badges.get(id);
  }

  async createBadge(insertBadge: InsertBadge): Promise<Badge> {
    const id = randomUUID();
    const badge: Badge = { ...insertBadge, id };
    this.badges.set(id, badge);
    return badge;
  }

  async getDriverBadges(driverId: string): Promise<(DriverBadge & { badge: Badge })[]> {
    const driverBadgesList = Array.from(this.driverBadges.values()).filter(
      (db) => db.driverId === driverId
    );
    return driverBadgesList.map((db) => ({
      ...db,
      badge: this.badges.get(db.badgeId)!,
    }));
  }

  async awardBadge(insertDriverBadge: InsertDriverBadge): Promise<DriverBadge> {
    const id = randomUUID();
    const driverBadge: DriverBadge = {
      ...insertDriverBadge,
      id,
      tripId: insertDriverBadge.tripId || null,
      earnedAt: new Date(),
    };
    this.driverBadges.set(id, driverBadge);
    return driverBadge;
  }

  // Vouchers & Redemptions
  async getAllVouchers(): Promise<Voucher[]> {
    return Array.from(this.vouchers.values());
  }

  async getVoucher(id: string): Promise<Voucher | undefined> {
    return this.vouchers.get(id);
  }

  async createVoucher(insertVoucher: InsertVoucher): Promise<Voucher> {
    const id = randomUUID();
    const voucher: Voucher = {
      ...insertVoucher,
      id,
      imageUrl: insertVoucher.imageUrl || null,
    };
    this.vouchers.set(id, voucher);
    return voucher;
  }

  async redeemVoucher(insertRedemption: InsertRedemption): Promise<Redemption> {
    const id = randomUUID();
    const redemption: Redemption = {
      ...insertRedemption,
      id,
      redeemedAt: new Date(),
      usedAt: null,
      status: "active",
    };
    this.redemptions.set(id, redemption);
    return redemption;
  }

  async getRedemptionsByDriver(driverId: string): Promise<(Redemption & { voucher: Voucher })[]> {
    const redemptionsList = Array.from(this.redemptions.values()).filter(
      (r) => r.driverId === driverId
    );
    return redemptionsList.map((r) => ({
      ...r,
      voucher: this.vouchers.get(r.voucherId)!,
    }));
  }

  // Nearby Places
  async getAllNearbyPlaces(): Promise<NearbyPlace[]> {
    return Array.from(this.nearbyPlaces.values());
  }

  async getNearbyPlacesByCategory(category: string): Promise<NearbyPlace[]> {
    return Array.from(this.nearbyPlaces.values()).filter((p) => p.category === category);
  }

  async createNearbyPlace(insertPlace: InsertNearbyPlace): Promise<NearbyPlace> {
    const id = randomUUID();
    const place: NearbyPlace = {
      ...insertPlace,
      id,
      isVeg: insertPlace.isVeg || null,
      isNonVeg: insertPlace.isNonVeg || null,
      hasTruckParking: insertPlace.hasTruckParking || false,
      hygieneRating: insertPlace.hygieneRating || null,
      isOpen: insertPlace.isOpen !== undefined ? insertPlace.isOpen : true,
      discount: insertPlace.discount || null,
      imageUrl: insertPlace.imageUrl || null,
      verifiedBy: insertPlace.verifiedBy || null,
      createdAt: new Date(),
    };
    this.nearbyPlaces.set(id, place);
    return place;
  }

  // Community Posts
  async getAllCommunityPosts(): Promise<(CommunityPost & { driver: Driver })[]> {
    const posts = Array.from(this.communityPosts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return posts.map((p) => ({
      ...p,
      driver: this.drivers.get(p.driverId)!,
    }));
  }

  async getCommunityPost(id: string): Promise<CommunityPost | undefined> {
    return this.communityPosts.get(id);
  }

  async createCommunityPost(insertPost: InsertCommunityPost): Promise<CommunityPost> {
    const id = randomUUID();
    const post: CommunityPost = {
      ...insertPost,
      id,
      images: insertPost.images || [],
      likes: insertPost.likes || 0,
      comments: insertPost.comments || 0,
      createdAt: new Date(),
    };
    this.communityPosts.set(id, post);
    return post;
  }

  async updateCommunityPostLikes(id: string, increment: number): Promise<void> {
    const post = this.communityPosts.get(id);
    if (post) {
      post.likes += increment;
      this.communityPosts.set(id, post);
    }
  }

  // Wellness Tips
  async getAllWellnessTips(): Promise<WellnessTip[]> {
    return Array.from(this.wellnessTips.values());
  }

  async createWellnessTip(insertTip: InsertWellnessTip): Promise<WellnessTip> {
    const id = randomUUID();
    const tip: WellnessTip = { ...insertTip, id };
    this.wellnessTips.set(id, tip);
    return tip;
  }

  // Routes
  async createRoute(insertRoute: InsertRoute): Promise<Route> {
    const id = randomUUID();
    const route: Route = {
      ...insertRoute,
      id,
      waypoints: insertRoute.waypoints || [],
      optimized: insertRoute.optimized || false,
      createdAt: new Date(),
    };
    this.routes.set(id, route);
    return route;
  }

  async getRoute(id: string): Promise<Route | undefined> {
    return this.routes.get(id);
  }

  async getRoutesByDriver(driverId: string): Promise<Route[]> {
    return Array.from(this.routes.values()).filter((r) => r.driverId === driverId);
  }

  // Support Resources
  async getAllSupportResources(): Promise<SupportResource[]> {
    return Array.from(this.supportResources.values());
  }

  async getSupportResourcesByCategory(category: string): Promise<SupportResource[]> {
    return Array.from(this.supportResources.values()).filter((r) => r.category === category);
  }

  async createSupportResource(insertResource: InsertSupportResource): Promise<SupportResource> {
    const id = randomUUID();
    const resource: SupportResource = {
      ...insertResource,
      id,
      contactNumber: insertResource.contactNumber || null,
      website: insertResource.website || null,
      isVerified: insertResource.isVerified !== undefined ? insertResource.isVerified : true,
    };
    this.supportResources.set(id, resource);
    return resource;
  }

  // Fatigue Check-Ins
  async createFatigueCheckIn(insertCheckIn: InsertFatigueCheckIn): Promise<FatigueCheckIn> {
    const id = randomUUID();
    const checkIn: FatigueCheckIn = {
      ...insertCheckIn,
      id,
      tripId: insertCheckIn.tripId || null,
      response: insertCheckIn.response || null,
      actionTaken: insertCheckIn.actionTaken || null,
      checkInTime: new Date(),
    };
    this.fatigueCheckIns.set(id, checkIn);
    return checkIn;
  }

  async getFatigueCheckInsByDriver(driverId: string): Promise<FatigueCheckIn[]> {
    return Array.from(this.fatigueCheckIns.values())
      .filter((c) => c.driverId === driverId)
      .sort((a, b) => b.checkInTime.getTime() - a.checkInTime.getTime());
  }

  async getLatestFatigueCheckIn(driverId: string): Promise<FatigueCheckIn | undefined> {
    const checkIns = await this.getFatigueCheckInsByDriver(driverId);
    return checkIns[0];
  }

  // Road Alerts
  async getActiveRoadAlerts(): Promise<RoadAlert[]> {
    const now = new Date();
    return Array.from(this.roadAlerts.values())
      .filter((alert) => {
        if (!alert.isActive) return false;
        if (alert.expiresAt && alert.expiresAt < now) return false;
        return true;
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getRoadAlert(id: string): Promise<RoadAlert | undefined> {
    return this.roadAlerts.get(id);
  }

  async createRoadAlert(insertAlert: InsertRoadAlert): Promise<RoadAlert> {
    const id = randomUUID();
    const alert: RoadAlert = {
      ...insertAlert,
      id,
      latitude: insertAlert.latitude || null,
      longitude: insertAlert.longitude || null,
      reportedBy: insertAlert.reportedBy || null,
      isActive: insertAlert.isActive !== undefined ? insertAlert.isActive : true,
      createdAt: new Date(),
      expiresAt: insertAlert.expiresAt || null,
    };
    this.roadAlerts.set(id, alert);
    return alert;
  }

  async updateRoadAlert(id: string, updates: Partial<RoadAlert>): Promise<RoadAlert | undefined> {
    const alert = this.roadAlerts.get(id);
    if (!alert) return undefined;
    const updated = { ...alert, ...updates };
    this.roadAlerts.set(id, updated);
    return updated;
  }

  // Learning Videos
  async getAllLearningVideos(): Promise<LearningVideo[]> {
    return Array.from(this.learningVideos.values());
  }

  async getLearningVideosByCategory(category: string): Promise<LearningVideo[]> {
    return Array.from(this.learningVideos.values()).filter((v) => v.category === category);
  }

  async getLearningVideo(id: string): Promise<LearningVideo | undefined> {
    return this.learningVideos.get(id);
  }

  async createLearningVideo(insertVideo: InsertLearningVideo): Promise<LearningVideo> {
    const id = randomUUID();
    const video: LearningVideo = {
      ...insertVideo,
      id,
      thumbnailUrl: insertVideo.thumbnailUrl || null,
      videoUrl: insertVideo.videoUrl || null,
      pointsReward: insertVideo.pointsReward || 10,
      createdAt: new Date(),
    };
    this.learningVideos.set(id, video);
    return video;
  }

  async completeVideo(insertCompletion: InsertVideoCompletion): Promise<VideoCompletion> {
    const id = randomUUID();
    const completion: VideoCompletion = {
      ...insertCompletion,
      id,
      completedAt: new Date(),
    };
    this.videoCompletions.set(id, completion);
    return completion;
  }

  async getCompletedVideos(driverId: string): Promise<(VideoCompletion & { video: LearningVideo })[]> {
    const completions = Array.from(this.videoCompletions.values())
      .filter((c) => c.driverId === driverId)
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
    return completions.map((c) => ({
      ...c,
      video: this.learningVideos.get(c.videoId)!,
    }));
  }

  // Checklists
  async getAllChecklistTemplates(): Promise<ChecklistTemplate[]> {
    return Array.from(this.checklistTemplates.values());
  }

  async getChecklistTemplateByType(checklistType: string): Promise<ChecklistTemplate | undefined> {
    return Array.from(this.checklistTemplates.values()).find((t) => t.checklistType === checklistType);
  }

  async createChecklistTemplate(insertTemplate: InsertChecklistTemplate): Promise<ChecklistTemplate> {
    const id = randomUUID();
    const template: ChecklistTemplate = {
      ...insertTemplate,
      id,
    };
    this.checklistTemplates.set(id, template);
    return template;
  }

  async completeChecklist(insertCompletion: InsertChecklistCompletion): Promise<ChecklistCompletion> {
    const id = randomUUID();
    const completion: ChecklistCompletion = {
      ...insertCompletion,
      id,
      tripId: insertCompletion.tripId || null,
      notes: insertCompletion.notes || null,
      completedAt: new Date(),
    };
    this.checklistCompletions.set(id, completion);
    return completion;
  }

  async getChecklistCompletionsByDriver(driverId: string): Promise<ChecklistCompletion[]> {
    return Array.from(this.checklistCompletions.values())
      .filter((c) => c.driverId === driverId)
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
  }

  async getChecklistCompletionsByTrip(tripId: string): Promise<ChecklistCompletion[]> {
    return Array.from(this.checklistCompletions.values())
      .filter((c) => c.tripId === tripId)
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
  }

  // Upcoming Trips
  async createUpcomingTrip(insertTrip: InsertUpcomingTrip): Promise<UpcomingTrip> {
    const id = randomUUID();
    const trip: UpcomingTrip = {
      ...insertTrip,
      id,
      completedTripId: insertTrip.completedTripId || null,
      status: insertTrip.status || "upcoming",
      currentStopIndex: insertTrip.currentStopIndex || 0,
      startedAt: insertTrip.startedAt || null,
      completedAt: insertTrip.completedAt || null,
      notes: insertTrip.notes || null,
      createdAt: new Date(),
    };
    this.upcomingTrips.set(id, trip);
    return trip;
  }

  async getUpcomingTrip(id: string): Promise<UpcomingTrip | undefined> {
    return this.upcomingTrips.get(id);
  }

  async getUpcomingTripsByDriver(driverId: string): Promise<UpcomingTrip[]> {
    return Array.from(this.upcomingTrips.values())
      .filter((t) => t.driverId === driverId && t.status !== "completed")
      .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());
  }

  async updateUpcomingTrip(id: string, updates: Partial<UpcomingTrip>): Promise<UpcomingTrip | undefined> {
    const trip = this.upcomingTrips.get(id);
    if (!trip) return undefined;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    const updated = { ...trip, ...filteredUpdates };
    this.upcomingTrips.set(id, updated);
    return updated;
  }

  // Delivery Points
  async createDeliveryPoint(insertPoint: InsertDeliveryPoint): Promise<DeliveryPoint> {
    const id = randomUUID();
    const point: DeliveryPoint = {
      ...insertPoint,
      id,
      plannedArrival: insertPoint.plannedArrival || null,
      plannedDeparture: insertPoint.plannedDeparture || null,
      instructions: insertPoint.instructions || null,
      contactPhone: insertPoint.contactPhone || null,
      status: insertPoint.status || "pending",
      completedAt: insertPoint.completedAt || null,
    };
    this.deliveryPoints.set(id, point);
    return point;
  }

  async getAllDeliveryPoints(): Promise<DeliveryPoint[]> {
    return Array.from(this.deliveryPoints.values())
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async getDeliveryPointsByTrip(tripId: string): Promise<DeliveryPoint[]> {
    return Array.from(this.deliveryPoints.values())
      .filter((p) => p.tripId === tripId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async updateDeliveryPoint(id: string, updates: Partial<DeliveryPoint>): Promise<DeliveryPoint | undefined> {
    const point = this.deliveryPoints.get(id);
    if (!point) return undefined;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    const updated = { ...point, ...filteredUpdates };
    this.deliveryPoints.set(id, updated);
    return updated;
  }

  private seedData() {
    // Seed default driver
    const defaultDriver: Driver = {
      id: "default-driver-1",
      phoneNumber: "+919876543210",
      name: "Prakhar Raghuvansh",
      avatarUrl: null,
      level: "Pro Driver",
      totalPoints: 3000,
      currentStreak: 12,
      totalTrips: 145,
      createdAt: new Date(),
    };
    this.drivers.set(defaultDriver.id, defaultDriver);

    // Seed other drivers for leaderboard
    const otherDrivers: Driver[] = [
      { id: "driver-2", phoneNumber: "+918989522157", name: "Sujit Soni", avatarUrl: null, level: "Fleet Legend", totalPoints: 3450, currentStreak: 25, totalTrips: 230, createdAt: new Date() },
      { id: "driver-3", phoneNumber: "+919876543212", name: "Shubham Agarwal", avatarUrl: null, level: "Pro Driver", totalPoints: 3200, currentStreak: 18, totalTrips: 210, createdAt: new Date() },
      { id: "driver-4", phoneNumber: "+919876543213", name: "Sumandeep Singh", avatarUrl: null, level: "Pro Driver", totalPoints: 2850, currentStreak: 15, totalTrips: 195, createdAt: new Date() },
      { id: "driver-5", phoneNumber: "+919876543214", name: "Saurabh Ginde", avatarUrl: null, level: "Rookie Driver", totalPoints: 2700, currentStreak: 10, totalTrips: 175, createdAt: new Date() },
    ];
    otherDrivers.forEach((d) => this.drivers.set(d.id, d));

    // Seed badges
    const badgeData: InsertBadge[] = [
      { name: "Safety Star", description: "Zero harsh braking in a trip", iconName: "shield", pointValue: 20, criteria: "no_harsh_braking" },
      { name: "On-Time Hero", description: "Delivered on time", iconName: "clock", pointValue: 50, criteria: "on_time_delivery" },
      { name: "Eco Driver", description: "Excellent fuel efficiency", iconName: "leaf", pointValue: 20, criteria: "fuel_efficient" },
      { name: "Gold Driver", description: "7-day safe driving streak", iconName: "trophy", pointValue: 100, criteria: "7_day_streak" },
      { name: "Fleet Legend", description: "Top 10 weekly ranking", iconName: "crown", pointValue: 200, criteria: "top_10_weekly" },
      { name: "Contributor", description: "Active in community", iconName: "users", pointValue: 10, criteria: "community_contribution" },
    ];
    badgeData.forEach((b) => {
      const badge = { ...b, id: randomUUID() };
      this.badges.set(badge.id, badge);
    });

    // Seed vouchers
    const voucherData: InsertVoucher[] = [
      { name: "₹500 Fuel Voucher", description: "Valid at all HP pumps", pointCost: 500, category: "fuel", value: 500, imageUrl: null },
      { name: "₹300 Food Voucher", description: "Use at partner dhabas", pointCost: 300, category: "food", value: 300, imageUrl: null },
      { name: "₹200 Recharge", description: "Mobile recharge", pointCost: 200, category: "recharge", value: 200, imageUrl: null },
      { name: "₹1000 Fuel Voucher", description: "Valid at all HP pumps", pointCost: 1000, category: "fuel", value: 1000, imageUrl: null },
    ];
    voucherData.forEach((v) => {
      const voucher = { ...v, id: randomUUID(), imageUrl: v.imageUrl ?? null };
      this.vouchers.set(voucher.id, voucher);
    });

    // Seed nearby places
    const placeData: InsertNearbyPlace[] = [
      { name: "Highway Dhaba", category: "dhaba", latitude: 19.0760, longitude: 72.8777, address: "NH-48, Mumbai", isVeg: true, isNonVeg: true, hasTruckParking: true, hygieneRating: 5, isOpen: true, discount: 10, imageUrl: null, verifiedBy: null },
      { name: "Punjabi Tadka Dhaba", category: "dhaba", latitude: 19.1200, longitude: 72.9100, address: "NH-48, Thane", isVeg: true, isNonVeg: true, hasTruckParking: true, hygieneRating: 4, isOpen: true, discount: 15, imageUrl: null, verifiedBy: null },
      { name: "Amritsar Dhaba", category: "dhaba", latitude: 19.0500, longitude: 72.8300, address: "Mumbai-Pune Highway", isVeg: false, isNonVeg: true, hasTruckParking: true, hygieneRating: 5, isOpen: true, discount: null, imageUrl: null, verifiedBy: null },
      { name: "Rajdhani Pure Veg", category: "dhaba", latitude: 19.1500, longitude: 72.9500, address: "NH-48, Kalyan", isVeg: true, isNonVeg: false, hasTruckParking: true, hygieneRating: 5, isOpen: true, discount: 20, imageUrl: null, verifiedBy: null },
      { name: "Sankalp Restaurant", category: "dhaba", latitude: 19.0300, longitude: 72.8100, address: "Western Highway", isVeg: true, isNonVeg: false, hasTruckParking: false, hygieneRating: 4, isOpen: true, discount: null, imageUrl: null, verifiedBy: null },
      { name: "HP Petrol Pump", category: "fuel", latitude: 19.0850, longitude: 72.8950, address: "Western Express Highway", isVeg: null, isNonVeg: null, hasTruckParking: true, hygieneRating: null, isOpen: true, discount: 5, imageUrl: null, verifiedBy: null },
      { name: "Indian Oil Pump", category: "fuel", latitude: 19.1100, longitude: 72.9200, address: "NH-48, Thane East", isVeg: null, isNonVeg: null, hasTruckParking: true, hygieneRating: null, isOpen: true, discount: null, imageUrl: null, verifiedBy: null },
      { name: "Bharat Petroleum", category: "fuel", latitude: 19.0400, longitude: 72.8400, address: "Mumbai-Pune Expressway", isVeg: null, isNonVeg: null, hasTruckParking: true, hygieneRating: null, isOpen: true, discount: 10, imageUrl: null, verifiedBy: null },
      { name: "Shell Fuel Station", category: "fuel", latitude: 19.1600, longitude: 72.9600, address: "Eastern Express Highway", isVeg: null, isNonVeg: null, hasTruckParking: true, hygieneRating: null, isOpen: true, discount: null, imageUrl: null, verifiedBy: null },
      { name: "Quick Fix Auto Repair", category: "mechanic", latitude: 19.0650, longitude: 72.8650, address: "Industrial Area, Mumbai", isVeg: null, isNonVeg: null, hasTruckParking: true, hygieneRating: null, isOpen: true, discount: null, imageUrl: null, verifiedBy: null },
      { name: "24x7 Truck Service", category: "mechanic", latitude: 19.1300, longitude: 72.9300, address: "Thane-Belapur Road", isVeg: null, isNonVeg: null, hasTruckParking: true, hygieneRating: null, isOpen: true, discount: 15, imageUrl: null, verifiedBy: null },
      { name: "Highway Motors", category: "mechanic", latitude: 19.0200, longitude: 72.8000, address: "NH-48, Borivali", isVeg: null, isNonVeg: null, hasTruckParking: true, hygieneRating: null, isOpen: true, discount: null, imageUrl: null, verifiedBy: null },
      { name: "Tyre World & Service", category: "mechanic", latitude: 19.1700, longitude: 72.9700, address: "Kalyan-Shilphata Road", isVeg: null, isNonVeg: null, hasTruckParking: true, hygieneRating: null, isOpen: true, discount: 20, imageUrl: null, verifiedBy: null },
      { name: "Truck Parking Zone A", category: "parking", latitude: 19.0900, longitude: 72.9000, address: "Logistics Hub, Mumbai", isVeg: null, isNonVeg: null, hasTruckParking: true, hygieneRating: null, isOpen: true, discount: null, imageUrl: null, verifiedBy: null },
      { name: "Safe Park Truck Zone", category: "parking", latitude: 19.1400, longitude: 72.9400, address: "Industrial Estate, Thane", isVeg: null, isNonVeg: null, hasTruckParking: true, hygieneRating: null, isOpen: true, discount: null, imageUrl: null, verifiedBy: null },
      { name: "Night Parking Hub", category: "parking", latitude: 19.0100, longitude: 72.7900, address: "NH-48, Dahisar", isVeg: null, isNonVeg: null, hasTruckParking: true, hygieneRating: null, isOpen: true, discount: null, imageUrl: null, verifiedBy: null },
    ];
    placeData.forEach((p) => {
      const place: NearbyPlace = { 
        ...p, 
        id: randomUUID(), 
        createdAt: new Date(),
        imageUrl: p.imageUrl ?? null,
        verifiedBy: p.verifiedBy ?? null,
        hygieneRating: p.hygieneRating ?? null,
        discount: p.discount ?? null,
        isVeg: p.isVeg ?? null,
        isNonVeg: p.isNonVeg ?? null,
        hasTruckParking: p.hasTruckParking ?? null,
        isOpen: p.isOpen ?? true
      };
      this.nearbyPlaces.set(place.id, place);
    });

    // Seed wellness tips
    const tipData: InsertWellnessTip[] = [
      { title: "Take Regular Breaks", content: "Stop every 2 hours for a 15-minute break.", category: "safety", iconName: "clock" },
      { title: "Stay Hydrated", content: "Keep a water bottle handy and sip regularly.", category: "hydration", iconName: "droplets" },
      { title: "Maintain Good Posture", content: "Adjust your seat to support your lower back.", category: "posture", iconName: "activity" },
    ];
    tipData.forEach((t) => {
      const tip = { ...t, id: randomUUID() };
      this.wellnessTips.set(tip.id, tip);
    });

    // Seed community posts
    const postData = [
      { driverId: "driver-2", content: "Just completed a 500km trip with zero harsh braking! Focus and patience pays off. Stay safe everyone!", images: [], category: "story", likes: 45, comments: 12 },
      { driverId: "driver-3", content: "Pro tip: Always check tire pressure before long hauls.", images: [], category: "tip", likes: 78, comments: 23 },
    ];
    postData.forEach((p) => {
      const post = { ...p, id: randomUUID(), createdAt: new Date() };
      this.communityPosts.set(post.id, post);
    });

    // Seed support resources
    const supportData: InsertSupportResource[] = [
      { title: "Accidental Insurance", description: "Get coverage for truck accidents. Comprehensive protection for your vehicle and cargo.", category: "accidental_insurance", contactNumber: "1800-123-4567", website: "https://truckinsure.com", iconName: "shield-check", isVerified: true },
      { title: "Health Insurance for Drivers", description: "Affordable health insurance plans designed for professional drivers.", category: "health_insurance", contactNumber: "1800-234-5678", website: "https://driverhealth.com", iconName: "heart-pulse", isVerified: true },
      { title: "Emergency Cash Advance", description: "Quick cash loans for urgent needs on the road. Instant approval for verified drivers.", category: "loan", contactNumber: "1800-345-6789", website: "https://quickcash.com", iconName: "indian-rupee", isVerified: true },
      { title: "Emergency Fund Support", description: "Financial assistance during emergencies. No-questions-asked support for medical or vehicle emergencies.", category: "emergency_fund", contactNumber: "1800-456-7890", website: "https://emergencyfund.com", iconName: "life-buoy", isVerified: true },
      { title: "Truck Loan & Finance", description: "Low-interest loans for purchasing new trucks. Easy EMI options available.", category: "loan", contactNumber: "1800-567-8901", website: "https://truckfinance.com", iconName: "truck", isVerified: true },
    ];
    supportData.forEach((s) => {
      const resource: SupportResource = { 
        ...s, 
        id: randomUUID(),
        contactNumber: s.contactNumber ?? null,
        website: s.website ?? null,
        isVerified: s.isVerified ?? true
      };
      this.supportResources.set(resource.id, resource);
    });

    // Seed more nearby places (highway help services)
    const helpServiceData: InsertNearbyPlace[] = [
      { name: "Highway Towing Service", category: "towing", latitude: 19.0800, longitude: 72.8800, address: "NH-48, Mumbai Outskirts", isVeg: null, isNonVeg: null, hasTruckParking: true, hygieneRating: null, isOpen: true, discount: null, imageUrl: null, verifiedBy: null },
      { name: "24/7 Roadside Assistance", category: "towing", latitude: 19.1350, longitude: 72.9350, address: "Eastern Freeway, Thane", isVeg: null, isNonVeg: null, hasTruckParking: true, hygieneRating: null, isOpen: true, discount: 10, imageUrl: null, verifiedBy: null },
      { name: "Emergency Medical Clinic", category: "clinic", latitude: 19.0700, longitude: 72.8700, address: "Highway Medical Center, Mumbai", isVeg: null, isNonVeg: null, hasTruckParking: false, hygieneRating: null, isOpen: true, discount: null, imageUrl: null, verifiedBy: null },
      { name: "24Hr Highway Hospital", category: "clinic", latitude: 19.1450, longitude: 72.9450, address: "NH-48, Kalyan", isVeg: null, isNonVeg: null, hasTruckParking: true, hygieneRating: null, isOpen: true, discount: null, imageUrl: null, verifiedBy: null },
      { name: "RTO Office Mumbai", category: "rto", latitude: 19.0550, longitude: 72.8550, address: "Western Express Highway, Andheri", isVeg: null, isNonVeg: null, hasTruckParking: false, hygieneRating: null, isOpen: true, discount: null, imageUrl: null, verifiedBy: null },
      { name: "RTO Office Thane", category: "rto", latitude: 19.1900, longitude: 72.9700, address: "Ghodbunder Road, Thane", isVeg: null, isNonVeg: null, hasTruckParking: true, hygieneRating: null, isOpen: true, discount: null, imageUrl: null, verifiedBy: null },
      { name: "Highway Police Station", category: "police", latitude: 19.0950, longitude: 72.9050, address: "Mumbai-Nasik Highway, Bhiwandi", isVeg: null, isNonVeg: null, hasTruckParking: false, hygieneRating: null, isOpen: true, discount: null, imageUrl: null, verifiedBy: null },
      { name: "Traffic Police Checkpoint", category: "police", latitude: 19.1550, longitude: 72.9550, address: "Eastern Express Highway", isVeg: null, isNonVeg: null, hasTruckParking: false, hygieneRating: null, isOpen: true, discount: null, imageUrl: null, verifiedBy: null },
      { name: "Puncture Repair Shop", category: "puncture", latitude: 19.0650, longitude: 72.8650, address: "Service Road, NH-48", isVeg: null, isNonVeg: null, hasTruckParking: true, hygieneRating: null, isOpen: true, discount: null, imageUrl: null, verifiedBy: null },
      { name: "Fast Tyre Fix", category: "puncture", latitude: 19.1250, longitude: 72.9250, address: "Thane-Belapur Road", isVeg: null, isNonVeg: null, hasTruckParking: true, hygieneRating: null, isOpen: true, discount: 15, imageUrl: null, verifiedBy: null },
    ];
    helpServiceData.forEach((p) => {
      const place: NearbyPlace = { 
        ...p, 
        id: randomUUID(), 
        createdAt: new Date(),
        imageUrl: p.imageUrl ?? null,
        verifiedBy: p.verifiedBy ?? null,
        hygieneRating: p.hygieneRating ?? null,
        discount: p.discount ?? null,
        isVeg: p.isVeg ?? null,
        isNonVeg: p.isNonVeg ?? null,
        hasTruckParking: p.hasTruckParking ?? null,
        isOpen: p.isOpen ?? true
      };
      this.nearbyPlaces.set(place.id, place);
    });

    // Seed road alerts
    const alertData: InsertRoadAlert[] = [
      { title: "Accident Ahead", description: "Major accident on NH-48 near Thane exit. Traffic diverted.", alertType: "accident", severity: "high", location: "NH-48, Thane Exit", latitude: 19.2000, longitude: 72.9800, reportedBy: null, isActive: true, expiresAt: null },
      { title: "Heavy Rain Warning", description: "Heavy rainfall expected in next 2 hours. Drive carefully.", alertType: "weather", severity: "medium", location: "Mumbai-Pune Highway", latitude: 19.0000, longitude: 73.0000, reportedBy: null, isActive: true, expiresAt: null },
      { title: "Road Under Construction", description: "Single lane operation for next 5km. Expect delays.", alertType: "blocked_road", severity: "low", location: "NH-48, Kalyan", latitude: 19.2400, longitude: 73.1300, reportedBy: null, isActive: true, expiresAt: null },
    ];
    alertData.forEach((a) => {
      const alert: RoadAlert = { 
        ...a, 
        id: randomUUID(), 
        createdAt: new Date(),
        latitude: a.latitude || null,
        longitude: a.longitude || null,
        reportedBy: a.reportedBy || null,
        expiresAt: a.expiresAt || null,
        isActive: a.isActive || true
      };
      this.roadAlerts.set(alert.id, alert);
    });

    // Seed learning videos
    const videoData: InsertLearningVideo[] = [
      { title: "Tyre Safety Check", description: "Learn how to check tyre pressure and tread depth properly.", category: "tyres", duration: 30, pointsReward: 10, thumbnailUrl: null, videoUrl: null, iconName: "circle-dot" },
      { title: "Braking Techniques", description: "Master emergency braking and avoid skidding.", category: "braking", duration: 25, pointsReward: 10, thumbnailUrl: null, videoUrl: null, iconName: "octagon" },
      { title: "Night Driving Safety", description: "Essential tips for safe driving after dark.", category: "night_driving", duration: 20, pointsReward: 10, thumbnailUrl: null, videoUrl: null, iconName: "moon" },
      { title: "Emergency Handling", description: "What to do when your truck breaks down.", category: "emergency", duration: 30, pointsReward: 15, thumbnailUrl: null, videoUrl: null, iconName: "siren" },
      { title: "Basic Maintenance", description: "Daily checks every driver should perform.", category: "maintenance", duration: 25, pointsReward: 10, thumbnailUrl: null, videoUrl: null, iconName: "wrench" },
      { title: "Load Securing", description: "How to properly secure cargo to prevent accidents.", category: "maintenance", duration: 30, pointsReward: 15, thumbnailUrl: null, videoUrl: null, iconName: "package" },
    ];
    videoData.forEach((v) => {
      const video: LearningVideo = { 
        ...v, 
        id: randomUUID(), 
        createdAt: new Date(),
        thumbnailUrl: v.thumbnailUrl || null,
        videoUrl: v.videoUrl || null,
        pointsReward: v.pointsReward || 10
      };
      this.learningVideos.set(video.id, video);
    });

    // Seed checklist templates
    const checklistData: InsertChecklistTemplate[] = [
      { 
        name: "Pre-Trip Inspection", 
        checklistType: "pre_trip", 
        items: [
          "Check tyre pressure",
          "Test brakes",
          "Verify all lights working",
          "Check all documents (license, RC, insurance, pollution)",
          "Test horn",
          "Check engine oil level",
          "Inspect mirrors",
          "Check windshield wipers",
          "Verify cargo is secured",
          "Check fuel level"
        ]
      },
      { 
        name: "Post-Trip Review", 
        checklistType: "post_trip", 
        items: [
          "Check for any vehicle damage",
          "Report any maintenance issues",
          "Clean cabin area",
          "Verify all cargo delivered",
          "Log trip details",
          "Check tyre condition",
          "Report any safety concerns"
        ]
      },
    ];
    checklistData.forEach((c) => {
      const template: ChecklistTemplate = { ...c, id: randomUUID() };
      this.checklistTemplates.set(template.id, template);
    });

    // Seed upcoming trips with delivery points
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(7, 0, 0, 0);

    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    dayAfterTomorrow.setHours(9, 0, 0, 0);

    // Trip 1: Delhi City Route - 8 stops
    const trip1Id = randomUUID();
    const trip1: UpcomingTrip = {
      id: trip1Id,
      driverId: "default-driver-1",
      completedTripId: null,
      title: "Delhi City Distribution",
      scheduledTime: tomorrow,
      startLocation: "Azadpur Mandi Warehouse",
      startLat: 28.7041,
      startLng: 77.1025,
      endLocation: "Nehru Place Depot",
      endLat: 28.5494,
      endLng: 77.2505,
      status: "upcoming",
      currentStopIndex: 0,
      startedAt: null,
      completedAt: null,
      notes: null,
      createdAt: new Date(),
    };
    this.upcomingTrips.set(trip1Id, trip1);

    const trip1Points: InsertDeliveryPoint[] = [
      { tripId: trip1Id, orderIndex: 0, locationType: "warehouse", name: "Azadpur Mandi", address: "Azadpur Agricultural Produce Market, Delhi", latitude: 28.7041, longitude: 77.1025, plannedArrival: null, plannedDeparture: null, instructions: "Pick up fresh produce", contactPhone: "+91-11-27675050", status: "pending", completedAt: null },
      { tripId: trip1Id, orderIndex: 1, locationType: "shop", name: "Rajouri Garden Store", address: "Shop 45, Rajouri Garden, Delhi", latitude: 28.6409, longitude: 77.1211, plannedArrival: null, plannedDeparture: null, instructions: "Deliver 50 crates", contactPhone: "+91-9876543001", status: "pending", completedAt: null },
      { tripId: trip1Id, orderIndex: 2, locationType: "shop", name: "Karol Bagh Market", address: "Pusa Road, Karol Bagh, Delhi", latitude: 28.6519, longitude: 77.1903, plannedArrival: null, plannedDeparture: null, instructions: "Deliver 30 crates", contactPhone: "+91-9876543002", status: "pending", completedAt: null },
      { tripId: trip1Id, orderIndex: 3, locationType: "shop", name: "Connaught Place Outlet", address: "CP Inner Circle, New Delhi", latitude: 28.6315, longitude: 77.2167, plannedArrival: null, plannedDeparture: null, instructions: "Premium delivery - handle with care", contactPhone: "+91-9876543003", status: "pending", completedAt: null },
      { tripId: trip1Id, orderIndex: 4, locationType: "shop", name: "Lajpat Nagar Market", address: "Lajpat Nagar Central Market, Delhi", latitude: 28.5678, longitude: 77.2431, plannedArrival: null, plannedDeparture: null, instructions: "Deliver 40 crates", contactPhone: "+91-9876543004", status: "pending", completedAt: null },
      { tripId: trip1Id, orderIndex: 5, locationType: "shop", name: "Saket Select City Walk", address: "Saket Mall, Delhi", latitude: 28.5244, longitude: 77.2066, plannedArrival: null, plannedDeparture: null, instructions: "Use loading dock B", contactPhone: "+91-9876543005", status: "pending", completedAt: null },
      { tripId: trip1Id, orderIndex: 6, locationType: "factory", name: "Okhla Industrial Area", address: "Phase 1, Okhla Industrial Estate", latitude: 28.5355, longitude: 77.2765, plannedArrival: null, plannedDeparture: null, instructions: "Collect empty crates", contactPhone: "+91-9876543006", status: "pending", completedAt: null },
      { tripId: trip1Id, orderIndex: 7, locationType: "warehouse", name: "Nehru Place Depot", address: "Nehru Place, South Delhi", latitude: 28.5494, longitude: 77.2505, plannedArrival: null, plannedDeparture: null, instructions: "Final drop and inspection", contactPhone: "+91-11-26431234", status: "pending", completedAt: null },
    ];
    trip1Points.forEach((p) => {
      const point: DeliveryPoint = { 
        ...p, 
        id: randomUUID(),
        status: p.status || "pending",
        plannedArrival: p.plannedArrival ?? null,
        plannedDeparture: p.plannedDeparture ?? null,
        instructions: p.instructions ?? null,
        contactPhone: p.contactPhone ?? null,
        completedAt: p.completedAt ?? null
      };
      this.deliveryPoints.set(point.id, point);
    });

    // Trip 2: Mumbai Dense Urban Route - 15 stops
    const trip2Id = randomUUID();
    const trip2: UpcomingTrip = {
      id: trip2Id,
      driverId: "default-driver-1",
      completedTripId: null,
      title: "Mumbai Express Delivery",
      scheduledTime: dayAfterTomorrow,
      startLocation: "JNPT Port Warehouse",
      startLat: 18.9526,
      startLng: 72.9498,
      endLocation: "Goregaon Logistics Hub",
      endLat: 19.1663,
      endLng: 72.8526,
      status: "upcoming",
      currentStopIndex: 0,
      startedAt: null,
      completedAt: null,
      notes: null,
      createdAt: new Date(),
    };
    this.upcomingTrips.set(trip2Id, trip2);

    const trip2Points: InsertDeliveryPoint[] = [
      { tripId: trip2Id, orderIndex: 0, locationType: "warehouse", name: "JNPT Port", address: "Jawaharlal Nehru Port, Navi Mumbai", latitude: 18.9526, longitude: 72.9498, plannedArrival: null, plannedDeparture: null, instructions: "Collect import containers", contactPhone: "+91-22-27244000", status: "pending", completedAt: null },
      { tripId: trip2Id, orderIndex: 1, locationType: "warehouse", name: "Vashi Hub", address: "Turbhe MIDC, Navi Mumbai", latitude: 19.0330, longitude: 73.0297, plannedArrival: null, plannedDeparture: null, instructions: "Transfer 20 boxes", contactPhone: "+91-9876543011", status: "pending", completedAt: null },
      { tripId: trip2Id, orderIndex: 2, locationType: "shop", name: "Panvel Market", address: "New Panvel East, Navi Mumbai", latitude: 19.0147, longitude: 73.1200, plannedArrival: null, plannedDeparture: null, instructions: "Deliver electronics", contactPhone: "+91-9876543012", status: "pending", completedAt: null },
      { tripId: trip2Id, orderIndex: 3, locationType: "shop", name: "Kurla West Store", address: "LBS Marg, Kurla West", latitude: 19.0728, longitude: 72.8826, plannedArrival: null, plannedDeparture: null, instructions: "Unload 15 boxes", contactPhone: "+91-9876543013", status: "pending", completedAt: null },
      { tripId: trip2Id, orderIndex: 4, locationType: "shop", name: "Bandra Linking Road", address: "Linking Road, Bandra West", latitude: 19.0596, longitude: 72.8295, plannedArrival: null, plannedDeparture: null, instructions: "Premium delivery", contactPhone: "+91-9876543014", status: "pending", completedAt: null },
      { tripId: trip2Id, orderIndex: 5, locationType: "shop", name: "Andheri Phoenix Mall", address: "High Street Phoenix, Andheri", latitude: 19.0892, longitude: 72.8842, plannedArrival: null, plannedDeparture: null, instructions: "Use mall entrance 3", contactPhone: "+91-9876543015", status: "pending", completedAt: null },
      { tripId: trip2Id, orderIndex: 6, locationType: "home", name: "Powai Residential", address: "Hiranandani Gardens, Powai", latitude: 19.1176, longitude: 72.9060, plannedArrival: null, plannedDeparture: null, instructions: "Home delivery - call before arrival", contactPhone: "+91-9876543016", status: "pending", completedAt: null },
      { tripId: trip2Id, orderIndex: 7, locationType: "factory", name: "Vikhroli Industrial", address: "MIDC, Vikhroli East", latitude: 19.1058, longitude: 72.9387, plannedArrival: null, plannedDeparture: null, instructions: "Factory gate 2", contactPhone: "+91-9876543017", status: "pending", completedAt: null },
      { tripId: trip2Id, orderIndex: 8, locationType: "shop", name: "Mulund Market", address: "LBS Marg, Mulund West", latitude: 19.1722, longitude: 72.9569, plannedArrival: null, plannedDeparture: null, instructions: "Deliver 25 units", contactPhone: "+91-9876543018", status: "pending", completedAt: null },
      { tripId: trip2Id, orderIndex: 9, locationType: "shop", name: "Thane Station Road", address: "Station Road, Thane East", latitude: 19.1826, longitude: 72.9780, plannedArrival: null, plannedDeparture: null, instructions: "Morning delivery preferred", contactPhone: "+91-9876543019", status: "pending", completedAt: null },
      { tripId: trip2Id, orderIndex: 10, locationType: "home", name: "Ghodbunder Road Villa", address: "Palm Beach Residency, Thane", latitude: 19.2403, longitude: 72.9724, plannedArrival: null, plannedDeparture: null, instructions: "Luxury home - careful handling", contactPhone: "+91-9876543020", status: "pending", completedAt: null },
      { tripId: trip2Id, orderIndex: 11, locationType: "shop", name: "Borivali West Shop", address: "IC Colony, Borivali West", latitude: 19.2403, longitude: 72.8492, plannedArrival: null, plannedDeparture: null, instructions: "Deliver 18 boxes", contactPhone: "+91-9876543021", status: "pending", completedAt: null },
      { tripId: trip2Id, orderIndex: 12, locationType: "shop", name: "Kandivali Market", address: "Mahavir Nagar, Kandivali West", latitude: 19.2094, longitude: 72.8507, plannedArrival: null, plannedDeparture: null, instructions: "Back entrance delivery", contactPhone: "+91-9876543022", status: "pending", completedAt: null },
      { tripId: trip2Id, orderIndex: 13, locationType: "shop", name: "Malad Infinity Mall", address: "Link Road, Malad West", latitude: 19.1868, longitude: 72.8389, plannedArrival: null, plannedDeparture: null, instructions: "Loading bay C", contactPhone: "+91-9876543023", status: "pending", completedAt: null },
      { tripId: trip2Id, orderIndex: 14, locationType: "warehouse", name: "Goregaon Logistics Hub", address: "Mindspace, Goregaon East", latitude: 19.1663, longitude: 72.8526, plannedArrival: null, plannedDeparture: null, instructions: "Final collection point", contactPhone: "+91-22-67890123", status: "pending", completedAt: null },
    ];
    trip2Points.forEach((p) => {
      const point: DeliveryPoint = { 
        ...p, 
        id: randomUUID(),
        status: p.status || "pending",
        plannedArrival: p.plannedArrival ?? null,
        plannedDeparture: p.plannedDeparture ?? null,
        instructions: p.instructions ?? null,
        contactPhone: p.contactPhone ?? null,
        completedAt: p.completedAt ?? null
      };
      this.deliveryPoints.set(point.id, point);
    });

    // Delivery points for Trip 3 (Bangalore - 6 stops)
    const trip3Id = randomUUID();
    const trip3: UpcomingTrip = {
      id: trip3Id,
      driverId: "default-driver-1",
      completedTripId: null,
      title: "Bangalore Corporate Deliveries",
      scheduledTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      startLocation: "Bangalore Airport Cargo",
      startLat: 13.1986,
      startLng: 77.7091,
      endLocation: "Bangalore Central Distribution Center",
      endLat: 12.9716,
      endLng: 77.5946,
      status: "upcoming",
      currentStopIndex: 0,
      startedAt: null,
      completedAt: null,
      notes: null,
      createdAt: new Date(),
    };
    this.upcomingTrips.set(trip3Id, trip3);

    const trip3Points: Omit<DeliveryPoint, "id">[] = [
      { tripId: trip3Id, address: "Infosys Campus, Electronic City", lat: 12.8493, lng: 77.6649, locationType: "office", contactPerson: "Rajesh Kumar", contactPhone: "+91-9876543210", otp: "3456", status: "pending", sequence: 1, estimatedArrival: null, actualArrival: null, deliveryProof: null },
      { tripId: trip3Id, address: "Wipro Corporate Office, Sarjapur", lat: 12.8893, lng: 77.7172, locationType: "office", contactPerson: "Priya Sharma", contactPhone: "+91-9876543211", otp: "7890", status: "pending", sequence: 2, estimatedArrival: null, actualArrival: null, deliveryProof: null },
      { tripId: trip3Id, address: "Manyata Tech Park, Nagavara", lat: 13.0447, lng: 77.6200, locationType: "office", contactPerson: "Ankit Verma", contactPhone: "+91-9876543212", otp: "2345", status: "pending", sequence: 3, estimatedArrival: null, actualArrival: null, deliveryProof: null },
      { tripId: trip3Id, address: "Prestige Tech Park, Marathahalli", lat: 12.9591, lng: 77.6974, locationType: "office", contactPerson: "Sneha Reddy", contactPhone: "+91-9876543213", otp: "6789", status: "pending", sequence: 4, estimatedArrival: null, actualArrival: null, deliveryProof: null },
      { tripId: trip3Id, address: "RMZ Ecoworld, Bellandur", lat: 12.9250, lng: 77.6794, locationType: "office", contactPerson: "Vikram Singh", contactPhone: "+91-9876543214", otp: "1234", status: "pending", sequence: 5, estimatedArrival: null, actualArrival: null, deliveryProof: null },
      { tripId: trip3Id, address: "Cessna Business Park, Kadubeesanahalli", lat: 12.9343, lng: 77.6906, locationType: "office", contactPerson: "Meera Iyer", contactPhone: "+91-9876543215", otp: "5678", status: "pending", sequence: 6, estimatedArrival: null, actualArrival: null, deliveryProof: null },
    ];
    trip3Points.forEach(point => {
      const id = randomUUID();
      this.deliveryPoints.set(id, { ...point, id });
    });

    // Delivery points for Trip 4 (Chennai - 5 stops)
    const trip4Id = randomUUID();
    const trip4: UpcomingTrip = {
      id: trip4Id,
      driverId: "default-driver-1",
      completedTripId: null,
      title: "Chennai Port Logistics",
      scheduledTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
      startLocation: "Chennai International Airport Cargo",
      startLat: 12.9960,
      startLng: 80.1650,
      endLocation: "Chennai Port Trust",
      endLat: 13.0627,
      endLng: 80.2809,
      status: "upcoming",
      currentStopIndex: 0,
      startedAt: null,
      completedAt: null,
      notes: null,
      createdAt: new Date(),
    };
    this.upcomingTrips.set(trip4Id, trip4);

    const trip4Points: InsertDeliveryPoint[] = [
      { tripId: trip4Id, orderIndex: 0, locationType: "warehouse", name: "Whitefield Logistics Hub", address: "ITPL Main Road, Whitefield, Bangalore", latitude: 12.9698, longitude: 77.7499, plannedArrival: null, plannedDeparture: null, instructions: "Load IT equipment for delivery", contactPhone: "+91-80-28451234", status: "pending", completedAt: null },
      { tripId: trip4Id, orderIndex: 1, locationType: "factory", name: "Peenya Industrial Area", address: "Peenya 4th Phase, Bangalore", latitude: 13.0297, longitude: 77.5202, plannedArrival: null, plannedDeparture: null, instructions: "Pick up manufactured components", contactPhone: "+91-9876543230", status: "pending", completedAt: null },
      { tripId: trip4Id, orderIndex: 2, locationType: "shop", name: "Indiranagar Tech Store", address: "100 Feet Road, Indiranagar, Bangalore", latitude: 12.9716, longitude: 77.6412, plannedArrival: null, plannedDeparture: null, instructions: "Deliver 20 boxes - signature required", contactPhone: "+91-9876543231", status: "pending", completedAt: null },
      { tripId: trip4Id, orderIndex: 3, locationType: "shop", name: "Koramangala Retail Center", address: "80 Feet Road, Koramangala, Bangalore", latitude: 12.9352, longitude: 77.6245, plannedArrival: null, plannedDeparture: null, instructions: "Deliver electronics - handle with care", contactPhone: "+91-9876543232", status: "pending", completedAt: null },
      { tripId: trip4Id, orderIndex: 4, locationType: "shop", name: "Jayanagar Shopping Complex", address: "4th Block, Jayanagar, Bangalore", latitude: 12.9250, longitude: 77.5937, plannedArrival: null, plannedDeparture: null, instructions: "Deliver 35 boxes via loading dock", contactPhone: "+91-9876543233", status: "pending", completedAt: null },
      { tripId: trip4Id, orderIndex: 5, locationType: "factory", name: "Electronic City Phase 1", address: "Hosur Road, Electronic City, Bangalore", latitude: 12.8456, longitude: 77.6603, plannedArrival: null, plannedDeparture: null, instructions: "Collect empty containers", contactPhone: "+91-9876543234", status: "pending", completedAt: null },
      { tripId: trip4Id, orderIndex: 6, locationType: "warehouse", name: "Bommanahalli Distribution Center", address: "Hosur Road, Bommanahalli, Bangalore", latitude: 12.9116, longitude: 77.6370, plannedArrival: null, plannedDeparture: null, instructions: "Final drop and inventory check", contactPhone: "+91-80-26785678", status: "pending", completedAt: null },
    ];
    trip4Points.forEach((p) => {
      const point: DeliveryPoint = { 
        ...p, 
        id: randomUUID(),
        status: p.status || "pending",
        plannedArrival: p.plannedArrival || null,
        plannedDeparture: p.plannedDeparture || null,
        instructions: p.instructions || null,
        contactPhone: p.contactPhone || null,
        completedAt: p.completedAt || null,
      };
      this.deliveryPoints.set(point.id, point);
    });
  }
}

export const storage = new MemStorage();