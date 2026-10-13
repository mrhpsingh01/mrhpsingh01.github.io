export const petConfig = {
  /**
   * "pikachu": Cute Pikachu that dashes to cursor and attacks with Thunderbolt & electric sparks
   * "dragon": Cute flying green dragon that shoots flames
   * "puppy": Original Mowgli 8-bit puppy cursor tracker
   * "none": Disable pets
   */
  mode: "pikachu" as "pikachu" | "dragon" | "puppy" | "none",
  name: "Pikachu",
  wakeText: "Wake up Pikachu",
  spawn: { x: 60, y: 80 },
  persistPosition: false,
};
