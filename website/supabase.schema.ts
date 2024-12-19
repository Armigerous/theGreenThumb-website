export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      attractsLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      attractsMapping: {
        Row: {
          attractsId: number | null
          id: number
          plantId: number | null
        }
        Insert: {
          attractsId?: number | null
          id?: number
          plantId?: number | null
        }
        Update: {
          attractsId?: number | null
          id?: number
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "attractsMapping_attractsId_fkey"
            columns: ["attractsId"]
            isOneToOne: false
            referencedRelation: "attractsLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attractsMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      availableSpaceToPlantLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      availableSpaceToPlantMapping: {
        Row: {
          available_space_to_plantId: number | null
          id: number
          plantId: number | null
        }
        Insert: {
          available_space_to_plantId?: number | null
          id?: number
          plantId?: number | null
        }
        Update: {
          available_space_to_plantId?: number | null
          id?: number
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "availableSpaceToPlantMapping_available_space_to_plantId_fkey"
            columns: ["available_space_to_plantId"]
            isOneToOne: false
            referencedRelation: "availableSpaceToPlantLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availableSpaceToPlantMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      barkAttachmentLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      barkAttachmentMapping: {
        Row: {
          bark_attachmentId: number | null
          id: number
          plantId: number | null
        }
        Insert: {
          bark_attachmentId?: number | null
          id?: number
          plantId?: number | null
        }
        Update: {
          bark_attachmentId?: number | null
          id?: number
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "barkAttachmentMapping_bark_attachmentId_fkey"
            columns: ["bark_attachmentId"]
            isOneToOne: false
            referencedRelation: "barkAttachmentLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "barkAttachmentMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      barkColorLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      barkColorMapping: {
        Row: {
          bark_colorId: number | null
          id: number
          plantId: number | null
        }
        Insert: {
          bark_colorId?: number | null
          id?: number
          plantId?: number | null
        }
        Update: {
          bark_colorId?: number | null
          id?: number
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "barkColorMapping_bark_colorId_fkey"
            columns: ["bark_colorId"]
            isOneToOne: false
            referencedRelation: "barkColorLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "barkColorMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      barkPlateShapeLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      barkPlateShapeMapping: {
        Row: {
          bark_plate_shapeId: number | null
          id: number
          plantId: number | null
        }
        Insert: {
          bark_plate_shapeId?: number | null
          id?: number
          plantId?: number | null
        }
        Update: {
          bark_plate_shapeId?: number | null
          id?: number
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "barkPlateShapeMapping_bark_plate_shapeId_fkey"
            columns: ["bark_plate_shapeId"]
            isOneToOne: false
            referencedRelation: "barkPlateShapeLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "barkPlateShapeMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      commonNames: {
        Row: {
          commonName: string | null
          id: number
          plantId: number | null
        }
        Insert: {
          commonName?: string | null
          id?: number
          plantId?: number | null
        }
        Update: {
          commonName?: string | null
          id?: number
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "commonNames_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      cultivars: {
        Row: {
          description: string | null
          id: number
          name: string | null
          plantId: number | null
        }
        Insert: {
          description?: string | null
          id?: number
          name?: string | null
          plantId?: number | null
        }
        Update: {
          description?: string | null
          id?: number
          name?: string | null
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cultivar_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      designFeatureLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      designFeatureMapping: {
        Row: {
          design_featureId: number | null
          id: number
          plantId: number | null
        }
        Insert: {
          design_featureId?: number | null
          id?: number
          plantId?: number | null
        }
        Update: {
          design_featureId?: number | null
          id?: number
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "designFeatureMapping_design_featureId_fkey"
            columns: ["design_featureId"]
            isOneToOne: false
            referencedRelation: "designFeatureLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designFeatureMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      emails: {
        Row: {
          email: string
        }
        Insert: {
          email: string
        }
        Update: {
          email?: string
        }
        Relationships: []
      }
      fireRiskLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      fireRiskMapping: {
        Row: {
          fire_riskId: number | null
          id: number
          plantId: number | null
        }
        Insert: {
          fire_riskId?: number | null
          id?: number
          plantId?: number | null
        }
        Update: {
          fire_riskId?: number | null
          id?: number
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fireRiskMapping_fire_riskId_fkey"
            columns: ["fire_riskId"]
            isOneToOne: false
            referencedRelation: "fireRiskLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fireRiskMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      flowerBloomTimeLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      flowerBloomTimeMapping: {
        Row: {
          flower_bloom_timeId: number | null
          id: number
          plantId: number | null
        }
        Insert: {
          flower_bloom_timeId?: number | null
          id?: number
          plantId?: number | null
        }
        Update: {
          flower_bloom_timeId?: number | null
          id?: number
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "flowerBloomTimeMapping_flower_bloom_timeId_fkey"
            columns: ["flower_bloom_timeId"]
            isOneToOne: false
            referencedRelation: "flowerBloomTimeLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flowerBloomTimeMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      flowerColorLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      flowerColorMapping: {
        Row: {
          flower_colorId: number | null
          id: number
          plantId: number | null
        }
        Insert: {
          flower_colorId?: number | null
          id?: number
          plantId?: number | null
        }
        Update: {
          flower_colorId?: number | null
          id?: number
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "flowerColorMapping_flower_colorId_fkey"
            columns: ["flower_colorId"]
            isOneToOne: false
            referencedRelation: "flowerColorLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flowerColorMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      flowerInflorescenceLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      flowerInflorescenceMapping: {
        Row: {
          flower_inflorescenceId: number | null
          id: number
          plantId: number | null
        }
        Insert: {
          flower_inflorescenceId?: number | null
          id?: number
          plantId?: number | null
        }
        Update: {
          flower_inflorescenceId?: number | null
          id?: number
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "flowerInflorescenceMapping_flower_inflorescenceId_fkey"
            columns: ["flower_inflorescenceId"]
            isOneToOne: false
            referencedRelation: "flowerInflorescenceLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flowerInflorescenceMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      flowerPetalsLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      flowerPetalsMapping: {
        Row: {
          flower_petalsId: number | null
          id: number
          plantId: number | null
        }
        Insert: {
          flower_petalsId?: number | null
          id?: number
          plantId?: number | null
        }
        Update: {
          flower_petalsId?: number | null
          id?: number
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "flowerPetalsMapping_flower_petalsId_fkey"
            columns: ["flower_petalsId"]
            isOneToOne: false
            referencedRelation: "flowerPetalsLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flowerPetalsMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      flowerShapeLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      flowerShapeMapping: {
        Row: {
          flower_shapeId: number | null
          id: number
          plantId: number | null
        }
        Insert: {
          flower_shapeId?: number | null
          id?: number
          plantId?: number | null
        }
        Update: {
          flower_shapeId?: number | null
          id?: number
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "flowerShapeMapping_flower_shapeId_fkey"
            columns: ["flower_shapeId"]
            isOneToOne: false
            referencedRelation: "flowerShapeLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flowerShapeMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      flowerSizeLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      flowerSizeMapping: {
        Row: {
          flower_sizeId: number | null
          id: number
          plantId: number | null
        }
        Insert: {
          flower_sizeId?: number | null
          id?: number
          plantId?: number | null
        }
        Update: {
          flower_sizeId?: number | null
          id?: number
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "flowerSizeMapping_flower_sizeId_fkey"
            columns: ["flower_sizeId"]
            isOneToOne: false
            referencedRelation: "flowerSizeLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flowerSizeMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      flowerValueToGardenerLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      flowerValueToGardenerMapping: {
        Row: {
          flower_value_to_gardenerId: number | null
          id: number
          plantId: number | null
        }
        Insert: {
          flower_value_to_gardenerId?: number | null
          id?: number
          plantId?: number | null
        }
        Update: {
          flower_value_to_gardenerId?: number | null
          id?: number
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "flowerValueToGardenerMapping_flower_value_to_gardenerId_fkey"
            columns: ["flower_value_to_gardenerId"]
            isOneToOne: false
            referencedRelation: "flowerValueToGardenerLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flowerValueToGardenerMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      fruitColorLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      fruitColorMapping: {
        Row: {
          fruit_colorId: number | null
          id: number
          plantId: number | null
        }
        Insert: {
          fruit_colorId?: number | null
          id?: number
          plantId?: number | null
        }
        Update: {
          fruit_colorId?: number | null
          id?: number
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fruitColorMapping_fruit_colorId_fkey"
            columns: ["fruit_colorId"]
            isOneToOne: false
            referencedRelation: "fruitColorLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fruitColorMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      fruitDisplayHarvestTimeLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      fruitDisplayHarvestTimeMapping: {
        Row: {
          fruit_display_harvest_timeId: number | null
          id: number
          plantId: number | null
        }
        Insert: {
          fruit_display_harvest_timeId?: number | null
          id?: number
          plantId?: number | null
        }
        Update: {
          fruit_display_harvest_timeId?: number | null
          id?: number
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fruitDisplayHarvestTimeMappin_fruit_display_harvest_timeId_fkey"
            columns: ["fruit_display_harvest_timeId"]
            isOneToOne: false
            referencedRelation: "fruitDisplayHarvestTimeLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fruitDisplayHarvestTimeMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      fruitLengthLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      fruitLengthMapping: {
        Row: {
          fruit_lengthId: number | null
          id: number
          plantId: number | null
        }
        Insert: {
          fruit_lengthId?: number | null
          id?: number
          plantId?: number | null
        }
        Update: {
          fruit_lengthId?: number | null
          id?: number
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fruitLengthMapping_fruit_lengthId_fkey"
            columns: ["fruit_lengthId"]
            isOneToOne: false
            referencedRelation: "fruitLengthLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fruitLengthMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      fruitTypeLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      fruitTypeMapping: {
        Row: {
          fruit_typeId: number | null
          id: number
          plantId: number | null
        }
        Insert: {
          fruit_typeId?: number | null
          id?: number
          plantId?: number | null
        }
        Update: {
          fruit_typeId?: number | null
          id?: number
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fruitTypeMapping_fruit_typeId_fkey"
            columns: ["fruit_typeId"]
            isOneToOne: false
            referencedRelation: "fruitTypeLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fruitTypeMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      fruitValueToGardenerLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      fruitValueToGardenerMapping: {
        Row: {
          fruit_value_to_gardenerId: number | null
          id: number
          plantId: number | null
        }
        Insert: {
          fruit_value_to_gardenerId?: number | null
          id?: number
          plantId?: number | null
        }
        Update: {
          fruit_value_to_gardenerId?: number | null
          id?: number
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fruitValueToGardenerMapping_fruit_value_to_gardenerId_fkey"
            columns: ["fruit_value_to_gardenerId"]
            isOneToOne: false
            referencedRelation: "fruitValueToGardenerLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fruitValueToGardenerMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      fruitWidthLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      fruitWidthMapping: {
        Row: {
          fruit_widthId: number | null
          id: number
          plantId: number | null
        }
        Insert: {
          fruit_widthId?: number | null
          id?: number
          plantId?: number | null
        }
        Update: {
          fruit_widthId?: number | null
          id?: number
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fruitWidthMapping_fruit_widthId_fkey"
            columns: ["fruit_widthId"]
            isOneToOne: false
            referencedRelation: "fruitWidthLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fruitWidthMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      gardenSpacesLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      gardenSpacesMapping: {
        Row: {
          garden_spacesId: number | null
          id: number
          plantId: number | null
        }
        Insert: {
          garden_spacesId?: number | null
          id?: number
          plantId?: number | null
        }
        Update: {
          garden_spacesId?: number | null
          id?: number
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "gardenSpacesMapping_garden_spacesId_fkey"
            columns: ["garden_spacesId"]
            isOneToOne: false
            referencedRelation: "gardenSpacesLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gardenSpacesMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      growthRateLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      growthRateMapping: {
        Row: {
          growth_rateId: number | null
          id: number
          plantId: number | null
        }
        Insert: {
          growth_rateId?: number | null
          id?: number
          plantId?: number | null
        }
        Update: {
          growth_rateId?: number | null
          id?: number
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "growthRateMapping_growth_rateId_fkey"
            columns: ["growth_rateId"]
            isOneToOne: false
            referencedRelation: "growthRateLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "growthRateMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      habitLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      habitMapping: {
        Row: {
          habitId: number | null
          id: number
          plantId: number | null
        }
        Insert: {
          habitId?: number | null
          id?: number
          plantId?: number | null
        }
        Update: {
          habitId?: number | null
          id?: number
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "habitMapping_habitId_fkey"
            columns: ["habitId"]
            isOneToOne: false
            referencedRelation: "habitLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "habitMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      landscapeLocationLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      landscapeLocationMapping: {
        Row: {
          id: number
          landscape_locationId: number | null
          plantId: number | null
        }
        Insert: {
          id?: number
          landscape_locationId?: number | null
          plantId?: number | null
        }
        Update: {
          id?: number
          landscape_locationId?: number | null
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "landscapeLocationMapping_landscape_locationId_fkey"
            columns: ["landscape_locationId"]
            isOneToOne: false
            referencedRelation: "landscapeLocationLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "landscapeLocationMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      landscapeThemeLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      landscapeThemeMapping: {
        Row: {
          id: number
          landscape_themeId: number | null
          plantId: number | null
        }
        Insert: {
          id?: number
          landscape_themeId?: number | null
          plantId?: number | null
        }
        Update: {
          id?: number
          landscape_themeId?: number | null
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "landscapeThemeMapping_landscape_themeId_fkey"
            columns: ["landscape_themeId"]
            isOneToOne: false
            referencedRelation: "landscapeThemeLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "landscapeThemeMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      leafArrangementLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      leafArrangementMapping: {
        Row: {
          id: number
          leaf_arrangementId: number | null
          plantId: number | null
        }
        Insert: {
          id?: number
          leaf_arrangementId?: number | null
          plantId?: number | null
        }
        Update: {
          id?: number
          leaf_arrangementId?: number | null
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leafArrangementMapping_leaf_arrangementId_fkey"
            columns: ["leaf_arrangementId"]
            isOneToOne: false
            referencedRelation: "leafArrangementLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leafArrangementMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      leafCharacteristicsLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      leafCharacteristicsMapping: {
        Row: {
          id: number
          leafCharacteristicId: number | null
          plantId: number | null
        }
        Insert: {
          id?: number
          leafCharacteristicId?: number | null
          plantId?: number | null
        }
        Update: {
          id?: number
          leafCharacteristicId?: number | null
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leafCharacteristicsMapping_leafCharacteristicId_fkey"
            columns: ["leafCharacteristicId"]
            isOneToOne: false
            referencedRelation: "leafCharacteristicsLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leafCharacteristicsMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      leafColorLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      leafColorMapping: {
        Row: {
          id: number
          leaf_colorId: number | null
          plantId: number | null
        }
        Insert: {
          id?: number
          leaf_colorId?: number | null
          plantId?: number | null
        }
        Update: {
          id?: number
          leaf_colorId?: number | null
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leafColorMapping_leaf_colorId_fkey"
            columns: ["leaf_colorId"]
            isOneToOne: false
            referencedRelation: "leafColorLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leafColorMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      leafFallColorLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      leafFallColorMapping: {
        Row: {
          id: number
          leaf_fall_colorId: number | null
          plantId: number | null
        }
        Insert: {
          id?: number
          leaf_fall_colorId?: number | null
          plantId?: number | null
        }
        Update: {
          id?: number
          leaf_fall_colorId?: number | null
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leafFallColorMapping_leaf_fall_colorId_fkey"
            columns: ["leaf_fall_colorId"]
            isOneToOne: false
            referencedRelation: "leafFallColorLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leafFallColorMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      leafFeelLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      leafFeelMapping: {
        Row: {
          id: number
          leaf_feelId: number | null
          plantId: number | null
        }
        Insert: {
          id?: number
          leaf_feelId?: number | null
          plantId?: number | null
        }
        Update: {
          id?: number
          leaf_feelId?: number | null
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leafFeelMapping_leaf_feelId_fkey"
            columns: ["leaf_feelId"]
            isOneToOne: false
            referencedRelation: "leafFeelLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leafFeelMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      leafHairsPresentLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      leafHairsPresentMapping: {
        Row: {
          id: number
          leaf_hairs_presentId: number | null
          plantId: number | null
        }
        Insert: {
          id?: number
          leaf_hairs_presentId?: number | null
          plantId?: number | null
        }
        Update: {
          id?: number
          leaf_hairs_presentId?: number | null
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leafHairsPresentMapping_leaf_hairs_presentId_fkey"
            columns: ["leaf_hairs_presentId"]
            isOneToOne: false
            referencedRelation: "leafHairsPresentLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leafHairsPresentMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      leafLengthLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      leafLengthMapping: {
        Row: {
          id: number
          leaf_lengthId: number | null
          plantId: number | null
        }
        Insert: {
          id?: number
          leaf_lengthId?: number | null
          plantId?: number | null
        }
        Update: {
          id?: number
          leaf_lengthId?: number | null
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leafLengthMapping_leaf_lengthId_fkey"
            columns: ["leaf_lengthId"]
            isOneToOne: false
            referencedRelation: "leafLengthLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leafLengthMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      leafMarginLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      leafMarginMapping: {
        Row: {
          id: number
          leaf_marginId: number | null
          plantId: number | null
        }
        Insert: {
          id?: number
          leaf_marginId?: number | null
          plantId?: number | null
        }
        Update: {
          id?: number
          leaf_marginId?: number | null
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leafMarginMapping_leaf_marginId_fkey"
            columns: ["leaf_marginId"]
            isOneToOne: false
            referencedRelation: "leafMarginLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leafMarginMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      leafShapeLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      leafShapeMapping: {
        Row: {
          id: number
          leaf_shapeId: number | null
          plantId: number | null
        }
        Insert: {
          id?: number
          leaf_shapeId?: number | null
          plantId?: number | null
        }
        Update: {
          id?: number
          leaf_shapeId?: number | null
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leafShapeMapping_leaf_shapeId_fkey"
            columns: ["leaf_shapeId"]
            isOneToOne: false
            referencedRelation: "leafShapeLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leafShapeMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      leafTypeLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      leafTypeMapping: {
        Row: {
          id: number
          leaf_typeId: number | null
          plantId: number | null
        }
        Insert: {
          id?: number
          leaf_typeId?: number | null
          plantId?: number | null
        }
        Update: {
          id?: number
          leaf_typeId?: number | null
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leafTypeMapping_leaf_typeId_fkey"
            columns: ["leaf_typeId"]
            isOneToOne: false
            referencedRelation: "leafTypeLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leafTypeMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      leafValueToGardenerLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      leafValueToGardenerMapping: {
        Row: {
          id: number
          leaf_value_to_gardenerId: number | null
          plantId: number | null
        }
        Insert: {
          id?: number
          leaf_value_to_gardenerId?: number | null
          plantId?: number | null
        }
        Update: {
          id?: number
          leaf_value_to_gardenerId?: number | null
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leafValueToGardenerMapping_leaf_value_to_gardenerId_fkey"
            columns: ["leaf_value_to_gardenerId"]
            isOneToOne: false
            referencedRelation: "leafValueToGardenerLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leafValueToGardenerMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      leafWidthLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      leafWidthMapping: {
        Row: {
          id: number
          leaf_widthId: number | null
          plantId: number | null
        }
        Insert: {
          id?: number
          leaf_widthId?: number | null
          plantId?: number | null
        }
        Update: {
          id?: number
          leaf_widthId?: number | null
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leafWidthMapping_leaf_widthId_fkey"
            columns: ["leaf_widthId"]
            isOneToOne: false
            referencedRelation: "leafWidthLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leafWidthMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      lifeCycleLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      lifeCycleMapping: {
        Row: {
          id: number
          life_cycleId: number | null
          plantId: number | null
        }
        Insert: {
          id?: number
          life_cycleId?: number | null
          plantId?: number | null
        }
        Update: {
          id?: number
          life_cycleId?: number | null
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lifeCycleMapping_life_cycleId_fkey"
            columns: ["life_cycleId"]
            isOneToOne: false
            referencedRelation: "lifeCycleLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lifeCycleMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      lightLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      lightMapping: {
        Row: {
          id: number
          lightId: number | null
          plantId: number | null
        }
        Insert: {
          id?: number
          lightId?: number | null
          plantId?: number | null
        }
        Update: {
          id?: number
          lightId?: number | null
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lightMapping_lightId_fkey"
            columns: ["lightId"]
            isOneToOne: false
            referencedRelation: "lightLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lightMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      mainPlantData: {
        Row: {
          bark_description: string | null
          description: string | null
          distribution: string | null
          edibility: string | null
          family: string | null
          flower_description: string | null
          fruit_description: string | null
          genus: string | null
          height_max: number | null
          height_min: number | null
          id: number
          leaf_description: string | null
          origin: string | null
          phonetic_spelling: string | null
          poison_symptoms: string | null
          poison_toxic_principle: string | null
          profile_video: string | null
          slug: string
          sound_file: string | null
          species: string | null
          stem_description: string | null
          uses: string | null
          width_max: number | null
          width_min: number | null
          wildlife_value: string | null
        }
        Insert: {
          bark_description?: string | null
          description?: string | null
          distribution?: string | null
          edibility?: string | null
          family?: string | null
          flower_description?: string | null
          fruit_description?: string | null
          genus?: string | null
          height_max?: number | null
          height_min?: number | null
          id: number
          leaf_description?: string | null
          origin?: string | null
          phonetic_spelling?: string | null
          poison_symptoms?: string | null
          poison_toxic_principle?: string | null
          profile_video?: string | null
          slug: string
          sound_file?: string | null
          species?: string | null
          stem_description?: string | null
          uses?: string | null
          width_max?: number | null
          width_min?: number | null
          wildlife_value?: string | null
        }
        Update: {
          bark_description?: string | null
          description?: string | null
          distribution?: string | null
          edibility?: string | null
          family?: string | null
          flower_description?: string | null
          fruit_description?: string | null
          genus?: string | null
          height_max?: number | null
          height_min?: number | null
          id?: number
          leaf_description?: string | null
          origin?: string | null
          phonetic_spelling?: string | null
          poison_symptoms?: string | null
          poison_toxic_principle?: string | null
          profile_video?: string | null
          slug?: string
          sound_file?: string | null
          species?: string | null
          stem_description?: string | null
          uses?: string | null
          width_max?: number | null
          width_min?: number | null
          wildlife_value?: string | null
        }
        Relationships: []
      }
      maintenanceLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      maintenanceMapping: {
        Row: {
          id: number
          maintenanceId: number | null
          plantId: number | null
        }
        Insert: {
          id?: number
          maintenanceId?: number | null
          plantId?: number | null
        }
        Update: {
          id?: number
          maintenanceId?: number | null
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenanceMapping_maintenanceId_fkey"
            columns: ["maintenanceId"]
            isOneToOne: false
            referencedRelation: "maintenanceLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenanceMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      ncRegionLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      ncRegionMapping: {
        Row: {
          id: number
          nc_regionId: number | null
          plantId: number | null
        }
        Insert: {
          id?: number
          nc_regionId?: number | null
          plantId?: number | null
        }
        Update: {
          id?: number
          nc_regionId?: number | null
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ncRegionMapping_nc_regionId_fkey"
            columns: ["nc_regionId"]
            isOneToOne: false
            referencedRelation: "ncRegionLookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ncRegionMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      plantImages: {
        Row: {
          altText: string | null
          attribution: string | null
          caption: string | null
          id: number
          img: string | null
          plantId: number | null
        }
        Insert: {
          altText?: string | null
          attribution?: string | null
          caption?: string | null
          id?: number
          img?: string | null
          plantId?: number | null
        }
        Update: {
          altText?: string | null
          attribution?: string | null
          caption?: string | null
          id?: number
          img?: string | null
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "plantImages_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      plantTypesLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      plantTypesMapping: {
        Row: {
          id: number
          plantId: number | null
          typeId: number | null
        }
        Insert: {
          id?: number
          plantId?: number | null
          typeId?: number | null
        }
        Update: {
          id?: number
          plantId?: number | null
          typeId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "plantTypesMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plantTypesMapping_typeId_fkey"
            columns: ["typeId"]
            isOneToOne: false
            referencedRelation: "plantTypesLookup"
            referencedColumns: ["id"]
          },
        ]
      }
      poisonDermatitisLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      poisonDermatitisMapping: {
        Row: {
          id: number
          plantId: number | null
          poison_dermatitisId: number | null
        }
        Insert: {
          id?: number
          plantId?: number | null
          poison_dermatitisId?: number | null
        }
        Update: {
          id?: number
          plantId?: number | null
          poison_dermatitisId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "poisonDermatitisMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poisonDermatitisMapping_poison_dermatitisId_fkey"
            columns: ["poison_dermatitisId"]
            isOneToOne: false
            referencedRelation: "poisonDermatitisLookup"
            referencedColumns: ["id"]
          },
        ]
      }
      poisonPartLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      poisonPartMapping: {
        Row: {
          id: number
          plantId: number | null
          poison_partId: number | null
        }
        Insert: {
          id?: number
          plantId?: number | null
          poison_partId?: number | null
        }
        Update: {
          id?: number
          plantId?: number | null
          poison_partId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "poisonPartMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poisonPartMapping_poison_partId_fkey"
            columns: ["poison_partId"]
            isOneToOne: false
            referencedRelation: "poisonPartLookup"
            referencedColumns: ["id"]
          },
        ]
      }
      poisonSeverityLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      poisonSeverityMapping: {
        Row: {
          id: number
          plantId: number | null
          poison_severityId: number | null
        }
        Insert: {
          id?: number
          plantId?: number | null
          poison_severityId?: number | null
        }
        Update: {
          id?: number
          plantId?: number | null
          poison_severityId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "poisonSeverityMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poisonSeverityMapping_poison_severityId_fkey"
            columns: ["poison_severityId"]
            isOneToOne: false
            referencedRelation: "poisonSeverityLookup"
            referencedColumns: ["id"]
          },
        ]
      }
      problemsLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      problemsMapping: {
        Row: {
          id: number
          plantId: number | null
          problemsId: number | null
        }
        Insert: {
          id?: number
          plantId?: number | null
          problemsId?: number | null
        }
        Update: {
          id?: number
          plantId?: number | null
          problemsId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "problemsMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problemsMapping_problemsId_fkey"
            columns: ["problemsId"]
            isOneToOne: false
            referencedRelation: "problemsLookup"
            referencedColumns: ["id"]
          },
        ]
      }
      propagationLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      propagationMapping: {
        Row: {
          id: number
          plantId: number | null
          propagationId: number | null
        }
        Insert: {
          id?: number
          plantId?: number | null
          propagationId?: number | null
        }
        Update: {
          id?: number
          plantId?: number | null
          propagationId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "propagationMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "propagationMapping_propagationId_fkey"
            columns: ["propagationId"]
            isOneToOne: false
            referencedRelation: "propagationLookup"
            referencedColumns: ["id"]
          },
        ]
      }
      resistanceToChallengesLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      resistanceToChallengesMapping: {
        Row: {
          id: number
          plantId: number | null
          resistance_to_challengesId: number | null
        }
        Insert: {
          id?: number
          plantId?: number | null
          resistance_to_challengesId?: number | null
        }
        Update: {
          id?: number
          plantId?: number | null
          resistance_to_challengesId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "resistanceToChallengesMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resistanceToChallengesMapping_resistance_to_challengesId_fkey"
            columns: ["resistance_to_challengesId"]
            isOneToOne: false
            referencedRelation: "resistanceToChallengesLookup"
            referencedColumns: ["id"]
          },
        ]
      }
      scientificNames: {
        Row: {
          plantId: number | null
          scientificName: string
        }
        Insert: {
          plantId?: number | null
          scientificName: string
        }
        Update: {
          plantId?: number | null
          scientificName?: string
        }
        Relationships: [
          {
            foreignKeyName: "scientificNames_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      soilDrainageLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      soilDrainageMapping: {
        Row: {
          id: number
          plantId: number | null
          soil_drainageId: number | null
        }
        Insert: {
          id?: number
          plantId?: number | null
          soil_drainageId?: number | null
        }
        Update: {
          id?: number
          plantId?: number | null
          soil_drainageId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "soilDrainageMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "soilDrainageMapping_soil_drainageId_fkey"
            columns: ["soil_drainageId"]
            isOneToOne: false
            referencedRelation: "soilDrainageLookup"
            referencedColumns: ["id"]
          },
        ]
      }
      soilPhLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      soilPhMapping: {
        Row: {
          id: number
          plantId: number | null
          soil_phId: number | null
        }
        Insert: {
          id?: number
          plantId?: number | null
          soil_phId?: number | null
        }
        Update: {
          id?: number
          plantId?: number | null
          soil_phId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "soilPhMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "soilPhMapping_soil_phId_fkey"
            columns: ["soil_phId"]
            isOneToOne: false
            referencedRelation: "soilPhLookup"
            referencedColumns: ["id"]
          },
        ]
      }
      soilTextureLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      soilTextureMapping: {
        Row: {
          id: number
          plantId: number | null
          soil_textureId: number | null
        }
        Insert: {
          id?: number
          plantId?: number | null
          soil_textureId?: number | null
        }
        Update: {
          id?: number
          plantId?: number | null
          soil_textureId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "soilTextureMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "soilTextureMapping_soil_textureId_fkey"
            columns: ["soil_textureId"]
            isOneToOne: false
            referencedRelation: "soilTextureLookup"
            referencedColumns: ["id"]
          },
        ]
      }
      stemAromaticLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      stemAromaticMapping: {
        Row: {
          id: number
          plantId: number | null
          stem_aromaticId: number | null
        }
        Insert: {
          id?: number
          plantId?: number | null
          stem_aromaticId?: number | null
        }
        Update: {
          id?: number
          plantId?: number | null
          stem_aromaticId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stemAromaticMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stemAromaticMapping_stem_aromaticId_fkey"
            columns: ["stem_aromaticId"]
            isOneToOne: false
            referencedRelation: "stemAromaticLookup"
            referencedColumns: ["id"]
          },
        ]
      }
      stemBudScalesLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      stemBudScalesMapping: {
        Row: {
          id: number
          plantId: number | null
          stem_bud_scalesId: number | null
        }
        Insert: {
          id?: number
          plantId?: number | null
          stem_bud_scalesId?: number | null
        }
        Update: {
          id?: number
          plantId?: number | null
          stem_bud_scalesId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stemBudScalesMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stemBudScalesMapping_stem_bud_scalesId_fkey"
            columns: ["stem_bud_scalesId"]
            isOneToOne: false
            referencedRelation: "stemBudScalesLookup"
            referencedColumns: ["id"]
          },
        ]
      }
      stemBudsLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      stemBudsMapping: {
        Row: {
          id: number
          plantId: number | null
          stem_budsId: number | null
        }
        Insert: {
          id?: number
          plantId?: number | null
          stem_budsId?: number | null
        }
        Update: {
          id?: number
          plantId?: number | null
          stem_budsId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stemBudsMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stemBudsMapping_stem_budsId_fkey"
            columns: ["stem_budsId"]
            isOneToOne: false
            referencedRelation: "stemBudsLookup"
            referencedColumns: ["id"]
          },
        ]
      }
      stemBudTerminalLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      stemBudTerminalMapping: {
        Row: {
          id: number
          plantId: number | null
          stem_bud_terminalId: number | null
        }
        Insert: {
          id?: number
          plantId?: number | null
          stem_bud_terminalId?: number | null
        }
        Update: {
          id?: number
          plantId?: number | null
          stem_bud_terminalId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stemBudTerminalMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stemBudTerminalMapping_stem_bud_terminalId_fkey"
            columns: ["stem_bud_terminalId"]
            isOneToOne: false
            referencedRelation: "stemBudTerminalLookup"
            referencedColumns: ["id"]
          },
        ]
      }
      stemColorLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      stemColorMapping: {
        Row: {
          id: number
          plantId: number | null
          stem_colorId: number | null
        }
        Insert: {
          id?: number
          plantId?: number | null
          stem_colorId?: number | null
        }
        Update: {
          id?: number
          plantId?: number | null
          stem_colorId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stemColorMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stemColorMapping_stem_colorId_fkey"
            columns: ["stem_colorId"]
            isOneToOne: false
            referencedRelation: "stemColorLookup"
            referencedColumns: ["id"]
          },
        ]
      }
      stemCrossSectionLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      stemCrossSectionMapping: {
        Row: {
          id: number
          plantId: number | null
          stem_cross_sectionId: number | null
        }
        Insert: {
          id?: number
          plantId?: number | null
          stem_cross_sectionId?: number | null
        }
        Update: {
          id?: number
          plantId?: number | null
          stem_cross_sectionId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stemCrossSectionMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stemCrossSectionMapping_stem_cross_sectionId_fkey"
            columns: ["stem_cross_sectionId"]
            isOneToOne: false
            referencedRelation: "stemCrossSectionLookup"
            referencedColumns: ["id"]
          },
        ]
      }
      stemFormLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      stemFormMapping: {
        Row: {
          id: number
          plantId: number | null
          stem_formId: number | null
        }
        Insert: {
          id?: number
          plantId?: number | null
          stem_formId?: number | null
        }
        Update: {
          id?: number
          plantId?: number | null
          stem_formId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stemFormMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stemFormMapping_stem_formId_fkey"
            columns: ["stem_formId"]
            isOneToOne: false
            referencedRelation: "stemFormLookup"
            referencedColumns: ["id"]
          },
        ]
      }
      stemLeafScarShapeLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      stemLeafScarShapeMapping: {
        Row: {
          id: number
          plantId: number | null
          stem_leaf_scar_shapeId: number | null
        }
        Insert: {
          id?: number
          plantId?: number | null
          stem_leaf_scar_shapeId?: number | null
        }
        Update: {
          id?: number
          plantId?: number | null
          stem_leaf_scar_shapeId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stemLeafScarShapeMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stemLeafScarShapeMapping_stem_leaf_scar_shapeId_fkey"
            columns: ["stem_leaf_scar_shapeId"]
            isOneToOne: false
            referencedRelation: "stemLeafScarShapeLookup"
            referencedColumns: ["id"]
          },
        ]
      }
      stemLenticelsLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      stemLenticelsMapping: {
        Row: {
          id: number
          plantId: number | null
          stem_lenticelsId: number | null
        }
        Insert: {
          id?: number
          plantId?: number | null
          stem_lenticelsId?: number | null
        }
        Update: {
          id?: number
          plantId?: number | null
          stem_lenticelsId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stemLenticelsMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stemLenticelsMapping_stem_lenticelsId_fkey"
            columns: ["stem_lenticelsId"]
            isOneToOne: false
            referencedRelation: "stemLenticelsLookup"
            referencedColumns: ["id"]
          },
        ]
      }
      stemPithLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      stemPithMapping: {
        Row: {
          id: number
          plantId: number | null
          stem_pithId: number | null
        }
        Insert: {
          id?: number
          plantId?: number | null
          stem_pithId?: number | null
        }
        Update: {
          id?: number
          plantId?: number | null
          stem_pithId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stemPithMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stemPithMapping_stem_pithId_fkey"
            columns: ["stem_pithId"]
            isOneToOne: false
            referencedRelation: "stemPithLookup"
            referencedColumns: ["id"]
          },
        ]
      }
      stemSurfaceLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      stemSurfaceMapping: {
        Row: {
          id: number
          plantId: number | null
          stem_surfaceId: number | null
        }
        Insert: {
          id?: number
          plantId?: number | null
          stem_surfaceId?: number | null
        }
        Update: {
          id?: number
          plantId?: number | null
          stem_surfaceId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stemSurfaceMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stemSurfaceMapping_stem_surfaceId_fkey"
            columns: ["stem_surfaceId"]
            isOneToOne: false
            referencedRelation: "stemSurfaceLookup"
            referencedColumns: ["id"]
          },
        ]
      }
      synonyms: {
        Row: {
          id: number
          name: string | null
          plantId: number | null
        }
        Insert: {
          id?: number
          name?: string | null
          plantId?: number | null
        }
        Update: {
          id?: number
          name?: string | null
          plantId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "synonyms_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
        ]
      }
      tagsLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      tagsMapping: {
        Row: {
          id: number
          plantId: number | null
          tagId: number | null
        }
        Insert: {
          id?: number
          plantId?: number | null
          tagId?: number | null
        }
        Update: {
          id?: number
          plantId?: number | null
          tagId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tagsMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tagsMapping_tagId_fkey"
            columns: ["tagId"]
            isOneToOne: false
            referencedRelation: "tagsLookup"
            referencedColumns: ["id"]
          },
        ]
      }
      textureLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      textureMapping: {
        Row: {
          id: number
          plantId: number | null
          textureId: number | null
        }
        Insert: {
          id?: number
          plantId?: number | null
          textureId?: number | null
        }
        Update: {
          id?: number
          plantId?: number | null
          textureId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "textureMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "textureMapping_textureId_fkey"
            columns: ["textureId"]
            isOneToOne: false
            referencedRelation: "textureLookup"
            referencedColumns: ["id"]
          },
        ]
      }
      usdaZoneLookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      usdaZoneMapping: {
        Row: {
          id: number
          plantId: number | null
          usda_zoneId: number | null
        }
        Insert: {
          id?: number
          plantId?: number | null
          usda_zoneId?: number | null
        }
        Update: {
          id?: number
          plantId?: number | null
          usda_zoneId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "usdaZoneMapping_plantId_fkey"
            columns: ["plantId"]
            isOneToOne: false
            referencedRelation: "mainPlantData"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usdaZoneMapping_usda_zoneId_fkey"
            columns: ["usda_zoneId"]
            isOneToOne: false
            referencedRelation: "usdaZoneLookup"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

