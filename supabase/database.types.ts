export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      attracts_lookup: {
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
      available_space_to_plant_lookup: {
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
      bark_attachment_lookup: {
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
      bark_color_lookup: {
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
      bark_plate_shape_lookup: {
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
      blog_posts: {
        Row: {
          author_id: string
          body: Json | null
          created_at: string | null
          description: string | null
          id: number
          main_image_url: string | null
          published_at: string | null
          slug: string
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          author_id: string
          body?: Json | null
          created_at?: string | null
          description?: string | null
          id?: number
          main_image_url?: string | null
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          author_id?: string
          body?: Json | null
          created_at?: string | null
          description?: string | null
          id?: number
          main_image_url?: string | null
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: []
      }
      cached_responses: {
        Row: {
          context: string | null
          created_at: string | null
          embedding: string | null
          id: number
          query: string
          response: string
        }
        Insert: {
          context?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: number
          query: string
          response: string
        }
        Update: {
          context?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: number
          query?: string
          response?: string
        }
        Relationships: []
      }
      cultivars: {
        Row: {
          description: string | null
          id: number
          name: string | null
          plant_id: number | null
        }
        Insert: {
          description?: string | null
          id?: number
          name?: string | null
          plant_id?: number | null
        }
        Update: {
          description?: string | null
          id?: number
          name?: string | null
          plant_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cultivars_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "main_plant_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cultivars_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plant_card_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cultivars_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plant_common_card_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cultivars_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plant_common_name_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cultivars_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plant_full_data"
            referencedColumns: ["id"]
          },
        ]
      }
      design_feature_lookup: {
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
      embeddings: {
        Row: {
          content: string
          embedding: string
          id: string
          resource_id: string | null
        }
        Insert: {
          content: string
          embedding: string
          id: string
          resource_id?: string | null
        }
        Update: {
          content?: string
          embedding?: string
          id?: string
          resource_id?: string | null
        }
        Relationships: []
      }
      fire_risk_lookup: {
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
      flower_bloom_time_lookup: {
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
      flower_color_lookup: {
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
      flower_inflorescence_lookup: {
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
      flower_petals_lookup: {
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
      flower_shape_lookup: {
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
      flower_size_lookup: {
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
      flower_value_to_gardener_lookup: {
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
      fruit_color_lookup: {
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
      fruit_display_harvest_time_lookup: {
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
      fruit_length_lookup: {
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
      fruit_type_lookup: {
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
      fruit_value_to_gardener_lookup: {
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
      fruit_width_lookup: {
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
      garden_spaces_lookup: {
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
      growth_rate_lookup: {
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
      habit_lookup: {
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
      landscape_location_lookup: {
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
      landscape_theme_lookup: {
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
      leaf_arrangement_lookup: {
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
      leaf_characteristics_lookup: {
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
      leaf_color_lookup: {
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
      leaf_fall_color_lookup: {
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
      leaf_feel_lookup: {
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
      leaf_hairs_present_lookup: {
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
      leaf_length_lookup: {
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
      leaf_margin_lookup: {
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
      leaf_shape_lookup: {
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
      leaf_type_lookup: {
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
      leaf_value_to_gardener_lookup: {
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
      leaf_width_lookup: {
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
      life_cycle_lookup: {
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
      light_lookup: {
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
      main_plant_data: {
        Row: {
          attracts_ids: Json | null
          available_space_to_plant_ids: Json | null
          bark_attachment_ids: Json | null
          bark_color_ids: Json | null
          bark_description: string | null
          bark_plate_shape_ids: Json | null
          common_names: Json | null
          description: string | null
          design_feature_ids: Json | null
          distribution: string | null
          edibility: string | null
          family: string | null
          fire_risk_id: number | null
          flower_bloom_time_ids: Json | null
          flower_color_ids: Json | null
          flower_description: string | null
          flower_inflorescence_ids: Json | null
          flower_petals_ids: Json | null
          flower_shape_ids: Json | null
          flower_size_id: number | null
          flower_value_to_gardener_ids: Json | null
          fruit_color_ids: Json | null
          fruit_description: string | null
          fruit_display_harvest_time_ids: Json | null
          fruit_length_id: number | null
          fruit_type_ids: Json | null
          fruit_value_to_gardener_ids: Json | null
          fruit_width_id: number | null
          garden_spaces_id: number | null
          genus: string | null
          growth_rate_id: number | null
          habit_ids: Json | null
          height_max: number | null
          height_min: number | null
          id: number
          landscape_location_ids: Json | null
          landscape_theme_ids: Json | null
          leaf_arrangement_ids: Json | null
          leaf_characteristics_ids: Json | null
          leaf_color_ids: Json | null
          leaf_description: string | null
          leaf_fall_color_ids: Json | null
          leaf_feel_ids: Json | null
          leaf_hairs_present_id: number | null
          leaf_length_id: number | null
          leaf_margin_ids: Json | null
          leaf_shape_ids: Json | null
          leaf_type_ids: Json | null
          leaf_value_to_gardener_ids: Json | null
          leaf_width_id: number | null
          life_cycle_ids: Json | null
          light_ids: Json | null
          maintenance_ids: Json | null
          nc_region_ids: Json | null
          origin: string | null
          phonetic_spelling: string | null
          plant_types_ids: Json | null
          poison_dermatitis_id: number | null
          poison_part_ids: Json | null
          poison_severity_id: number | null
          poison_symptoms: string | null
          poison_toxic_principle: string | null
          problems_ids: Json | null
          profile_video: string | null
          propagation_ids: Json | null
          resistance_to_challenges_ids: Json | null
          scientific_name: string
          slug: string
          soil_drainage_ids: Json | null
          soil_ph_ids: Json | null
          soil_texture_ids: Json | null
          sound_file: string | null
          species: string | null
          stem_aromatic_id: number | null
          stem_bud_scale_id: number | null
          stem_bud_terminal_id: number | null
          stem_buds_id: number | null
          stem_color_ids: Json | null
          stem_cross_section_id: number | null
          stem_description: string | null
          stem_form_id: number | null
          stem_leaf_scar_shape_id: number | null
          stem_lenticels_id: number | null
          stem_pith_id: number | null
          stem_surface_id: number | null
          synonyms: Json | null
          tags_ids: Json | null
          texture_id: number | null
          usda_zone_ids: Json | null
          uses: string | null
          width_max: number | null
          width_min: number | null
          wildlife_value: string | null
        }
        Insert: {
          attracts_ids?: Json | null
          available_space_to_plant_ids?: Json | null
          bark_attachment_ids?: Json | null
          bark_color_ids?: Json | null
          bark_description?: string | null
          bark_plate_shape_ids?: Json | null
          common_names?: Json | null
          description?: string | null
          design_feature_ids?: Json | null
          distribution?: string | null
          edibility?: string | null
          family?: string | null
          fire_risk_id?: number | null
          flower_bloom_time_ids?: Json | null
          flower_color_ids?: Json | null
          flower_description?: string | null
          flower_inflorescence_ids?: Json | null
          flower_petals_ids?: Json | null
          flower_shape_ids?: Json | null
          flower_size_id?: number | null
          flower_value_to_gardener_ids?: Json | null
          fruit_color_ids?: Json | null
          fruit_description?: string | null
          fruit_display_harvest_time_ids?: Json | null
          fruit_length_id?: number | null
          fruit_type_ids?: Json | null
          fruit_value_to_gardener_ids?: Json | null
          fruit_width_id?: number | null
          garden_spaces_id?: number | null
          genus?: string | null
          growth_rate_id?: number | null
          habit_ids?: Json | null
          height_max?: number | null
          height_min?: number | null
          id?: number
          landscape_location_ids?: Json | null
          landscape_theme_ids?: Json | null
          leaf_arrangement_ids?: Json | null
          leaf_characteristics_ids?: Json | null
          leaf_color_ids?: Json | null
          leaf_description?: string | null
          leaf_fall_color_ids?: Json | null
          leaf_feel_ids?: Json | null
          leaf_hairs_present_id?: number | null
          leaf_length_id?: number | null
          leaf_margin_ids?: Json | null
          leaf_shape_ids?: Json | null
          leaf_type_ids?: Json | null
          leaf_value_to_gardener_ids?: Json | null
          leaf_width_id?: number | null
          life_cycle_ids?: Json | null
          light_ids?: Json | null
          maintenance_ids?: Json | null
          nc_region_ids?: Json | null
          origin?: string | null
          phonetic_spelling?: string | null
          plant_types_ids?: Json | null
          poison_dermatitis_id?: number | null
          poison_part_ids?: Json | null
          poison_severity_id?: number | null
          poison_symptoms?: string | null
          poison_toxic_principle?: string | null
          problems_ids?: Json | null
          profile_video?: string | null
          propagation_ids?: Json | null
          resistance_to_challenges_ids?: Json | null
          scientific_name: string
          slug: string
          soil_drainage_ids?: Json | null
          soil_ph_ids?: Json | null
          soil_texture_ids?: Json | null
          sound_file?: string | null
          species?: string | null
          stem_aromatic_id?: number | null
          stem_bud_scale_id?: number | null
          stem_bud_terminal_id?: number | null
          stem_buds_id?: number | null
          stem_color_ids?: Json | null
          stem_cross_section_id?: number | null
          stem_description?: string | null
          stem_form_id?: number | null
          stem_leaf_scar_shape_id?: number | null
          stem_lenticels_id?: number | null
          stem_pith_id?: number | null
          stem_surface_id?: number | null
          synonyms?: Json | null
          tags_ids?: Json | null
          texture_id?: number | null
          usda_zone_ids?: Json | null
          uses?: string | null
          width_max?: number | null
          width_min?: number | null
          wildlife_value?: string | null
        }
        Update: {
          attracts_ids?: Json | null
          available_space_to_plant_ids?: Json | null
          bark_attachment_ids?: Json | null
          bark_color_ids?: Json | null
          bark_description?: string | null
          bark_plate_shape_ids?: Json | null
          common_names?: Json | null
          description?: string | null
          design_feature_ids?: Json | null
          distribution?: string | null
          edibility?: string | null
          family?: string | null
          fire_risk_id?: number | null
          flower_bloom_time_ids?: Json | null
          flower_color_ids?: Json | null
          flower_description?: string | null
          flower_inflorescence_ids?: Json | null
          flower_petals_ids?: Json | null
          flower_shape_ids?: Json | null
          flower_size_id?: number | null
          flower_value_to_gardener_ids?: Json | null
          fruit_color_ids?: Json | null
          fruit_description?: string | null
          fruit_display_harvest_time_ids?: Json | null
          fruit_length_id?: number | null
          fruit_type_ids?: Json | null
          fruit_value_to_gardener_ids?: Json | null
          fruit_width_id?: number | null
          garden_spaces_id?: number | null
          genus?: string | null
          growth_rate_id?: number | null
          habit_ids?: Json | null
          height_max?: number | null
          height_min?: number | null
          id?: number
          landscape_location_ids?: Json | null
          landscape_theme_ids?: Json | null
          leaf_arrangement_ids?: Json | null
          leaf_characteristics_ids?: Json | null
          leaf_color_ids?: Json | null
          leaf_description?: string | null
          leaf_fall_color_ids?: Json | null
          leaf_feel_ids?: Json | null
          leaf_hairs_present_id?: number | null
          leaf_length_id?: number | null
          leaf_margin_ids?: Json | null
          leaf_shape_ids?: Json | null
          leaf_type_ids?: Json | null
          leaf_value_to_gardener_ids?: Json | null
          leaf_width_id?: number | null
          life_cycle_ids?: Json | null
          light_ids?: Json | null
          maintenance_ids?: Json | null
          nc_region_ids?: Json | null
          origin?: string | null
          phonetic_spelling?: string | null
          plant_types_ids?: Json | null
          poison_dermatitis_id?: number | null
          poison_part_ids?: Json | null
          poison_severity_id?: number | null
          poison_symptoms?: string | null
          poison_toxic_principle?: string | null
          problems_ids?: Json | null
          profile_video?: string | null
          propagation_ids?: Json | null
          resistance_to_challenges_ids?: Json | null
          scientific_name?: string
          slug?: string
          soil_drainage_ids?: Json | null
          soil_ph_ids?: Json | null
          soil_texture_ids?: Json | null
          sound_file?: string | null
          species?: string | null
          stem_aromatic_id?: number | null
          stem_bud_scale_id?: number | null
          stem_bud_terminal_id?: number | null
          stem_buds_id?: number | null
          stem_color_ids?: Json | null
          stem_cross_section_id?: number | null
          stem_description?: string | null
          stem_form_id?: number | null
          stem_leaf_scar_shape_id?: number | null
          stem_lenticels_id?: number | null
          stem_pith_id?: number | null
          stem_surface_id?: number | null
          synonyms?: Json | null
          tags_ids?: Json | null
          texture_id?: number | null
          usda_zone_ids?: Json | null
          uses?: string | null
          width_max?: number | null
          width_min?: number | null
          wildlife_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "main_plant_data_fire_risk_id_fkey"
            columns: ["fire_risk_id"]
            isOneToOne: false
            referencedRelation: "fire_risk_lookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "main_plant_data_flower_size_id_fkey"
            columns: ["flower_size_id"]
            isOneToOne: false
            referencedRelation: "flower_size_lookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "main_plant_data_fruit_length_id_fkey"
            columns: ["fruit_length_id"]
            isOneToOne: false
            referencedRelation: "fruit_length_lookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "main_plant_data_fruit_width_id_fkey"
            columns: ["fruit_width_id"]
            isOneToOne: false
            referencedRelation: "fruit_width_lookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "main_plant_data_garden_spaces_id_fkey"
            columns: ["garden_spaces_id"]
            isOneToOne: false
            referencedRelation: "garden_spaces_lookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "main_plant_data_growth_rate_id_fkey"
            columns: ["growth_rate_id"]
            isOneToOne: false
            referencedRelation: "growth_rate_lookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "main_plant_data_leaf_hairs_present_id_fkey"
            columns: ["leaf_hairs_present_id"]
            isOneToOne: false
            referencedRelation: "leaf_hairs_present_lookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "main_plant_data_leaf_length_id_fkey"
            columns: ["leaf_length_id"]
            isOneToOne: false
            referencedRelation: "leaf_length_lookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "main_plant_data_leaf_width_id_fkey"
            columns: ["leaf_width_id"]
            isOneToOne: false
            referencedRelation: "leaf_width_lookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "main_plant_data_poison_dermatitis_id_fkey"
            columns: ["poison_dermatitis_id"]
            isOneToOne: false
            referencedRelation: "poison_dermatitis_lookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "main_plant_data_poison_severity_id_fkey"
            columns: ["poison_severity_id"]
            isOneToOne: false
            referencedRelation: "poison_severity_lookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "main_plant_data_stem_aromatic_id_fkey"
            columns: ["stem_aromatic_id"]
            isOneToOne: false
            referencedRelation: "stem_aromatic_lookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "main_plant_data_stem_bud_scale_id_fkey"
            columns: ["stem_bud_scale_id"]
            isOneToOne: false
            referencedRelation: "stem_bud_scales_lookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "main_plant_data_stem_bud_terminal_id_fkey"
            columns: ["stem_bud_terminal_id"]
            isOneToOne: false
            referencedRelation: "stem_bud_terminal_lookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "main_plant_data_stem_buds_id_fkey"
            columns: ["stem_buds_id"]
            isOneToOne: false
            referencedRelation: "stem_buds_lookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "main_plant_data_stem_cross_section_id_fkey"
            columns: ["stem_cross_section_id"]
            isOneToOne: false
            referencedRelation: "stem_cross_section_lookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "main_plant_data_stem_form_id_fkey"
            columns: ["stem_form_id"]
            isOneToOne: false
            referencedRelation: "stem_form_lookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "main_plant_data_stem_leaf_scar_shape_id_fkey"
            columns: ["stem_leaf_scar_shape_id"]
            isOneToOne: false
            referencedRelation: "stem_leaf_scar_shape_lookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "main_plant_data_stem_lenticels_id_fkey"
            columns: ["stem_lenticels_id"]
            isOneToOne: false
            referencedRelation: "stem_lenticels_lookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "main_plant_data_stem_pith_id_fkey"
            columns: ["stem_pith_id"]
            isOneToOne: false
            referencedRelation: "stem_pith_lookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "main_plant_data_stem_surface_id_fkey"
            columns: ["stem_surface_id"]
            isOneToOne: false
            referencedRelation: "stem_surface_lookup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "main_plant_data_texture_id_fkey"
            columns: ["texture_id"]
            isOneToOne: false
            referencedRelation: "texture_lookup"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_lookup: {
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
      nc_region_lookup: {
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
      plant_images: {
        Row: {
          alt_text: string | null
          attribution: string | null
          caption: string | null
          id: number
          img: string | null
          plant_id: number | null
        }
        Insert: {
          alt_text?: string | null
          attribution?: string | null
          caption?: string | null
          id?: number
          img?: string | null
          plant_id?: number | null
        }
        Update: {
          alt_text?: string | null
          attribution?: string | null
          caption?: string | null
          id?: number
          img?: string | null
          plant_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "plant_images_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "main_plant_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plant_images_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plant_card_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plant_images_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plant_common_card_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plant_images_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plant_common_name_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plant_images_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plant_full_data"
            referencedColumns: ["id"]
          },
        ]
      }
      plant_types_lookup: {
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
      poison_dermatitis_lookup: {
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
      poison_part_lookup: {
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
      poison_severity_lookup: {
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
      posts: {
        Row: {
          body: string | null
          category: string | null
          description: string | null
          id: number
          slug: string | null
          title: string
        }
        Insert: {
          body?: string | null
          category?: string | null
          description?: string | null
          id?: number
          slug?: string | null
          title: string
        }
        Update: {
          body?: string | null
          category?: string | null
          description?: string | null
          id?: number
          slug?: string | null
          title?: string
        }
        Relationships: []
      }
      problems_lookup: {
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
      propagation_lookup: {
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
      resistance_to_challenges_lookup: {
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
      soil_drainage_lookup: {
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
      soil_ph_lookup: {
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
      soil_texture_lookup: {
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
      stem_aromatic_lookup: {
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
      stem_bud_scales_lookup: {
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
      stem_bud_terminal_lookup: {
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
      stem_buds_lookup: {
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
      stem_color_lookup: {
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
      stem_cross_section_lookup: {
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
      stem_form_lookup: {
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
      stem_leaf_scar_shape_lookup: {
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
      stem_lenticels_lookup: {
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
      stem_pith_lookup: {
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
      stem_surface_lookup: {
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
      tags_lookup: {
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
      texture_lookup: {
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
      usda_zone_lookup: {
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
    }
    Views: {
      plant_autocomplete: {
        Row: {
          scientific_name: string | null
          slug: string | null
        }
        Relationships: []
      }
      plant_card_data: {
        Row: {
          description: string | null
          common_name: string | null
          first_image: string | null
          first_image_alt_text: string | null
          first_tag: string | null
          id: number | null
          scientific_name: string | null
          slug: string | null
        }
        Relationships: []
      }
      plant_common_card_data: {
        Row: {
          common_name: string | null
          description: string | null
          first_image: string | null
          first_image_alt_text: string | null
          first_tag: string | null
          id: number | null
          scientific_name: string | null
          scientific_slug: string | null
          slug: string | null
        }
        Relationships: []
      }
      plant_common_name_data: {
        Row: {
          attracts: Json | null
          available_space_to_plant: Json | null
          bark_attachment: Json | null
          bark_color: Json | null
          bark_description: string | null
          bark_plate_shape: Json | null
          common_name: string | null
          common_names: string[] | null
          cultivars: Json | null
          description: string | null
          design_feature: Json | null
          distribution: string | null
          edibility: string | null
          family: string | null
          fire_risk: string | null
          flower_bloom_time: Json | null
          flower_colors: Json | null
          flower_description: string | null
          flower_inflorescence: Json | null
          flower_petals: Json | null
          flower_shape: Json | null
          flower_size: string | null
          flower_value_to_gardener: Json | null
          fruit_color: Json | null
          fruit_description: string | null
          fruit_display_harvest_time: Json | null
          fruit_length: string | null
          fruit_type: Json | null
          fruit_value_to_gardener: Json | null
          fruit_width: string | null
          garden_spaces: string | null
          genus: string | null
          growth_rate: string | null
          height_max: number | null
          height_min: number | null
          id: number | null
          images: Json | null
          landscape_location: Json | null
          landscape_theme: Json | null
          leaf_arrangement: Json | null
          leaf_characteristics: Json | null
          leaf_color: Json | null
          leaf_description: string | null
          leaf_fall_color: Json | null
          leaf_feel: Json | null
          leaf_hairs_present: string | null
          leaf_length: string | null
          leaf_margin: Json | null
          leaf_shape: Json | null
          leaf_type: Json | null
          leaf_value_to_gardener: Json | null
          leaf_width: string | null
          life_cycle: Json | null
          light_requirements: Json | null
          maintenance: Json | null
          nc_regions: Json | null
          origin: string | null
          phonetic_spelling: string | null
          plant_habit: Json | null
          plant_types: Json | null
          poison_dermatitis: string | null
          poison_parts: Json | null
          poison_severity: string | null
          poison_symptoms: string | null
          poison_toxic_principle: string | null
          problems: Json | null
          profile_video: string | null
          propagation: Json | null
          resistance_to_challenges: Json | null
          scientific_name: string | null
          slug: string | null
          soil_drainage: Json | null
          soil_ph: Json | null
          soil_texture: Json | null
          sound_file: string | null
          species: string | null
          stem_aromatic: string | null
          stem_bud_scale: string | null
          stem_bud_terminal: string | null
          stem_buds: string | null
          stem_color: Json | null
          stem_cross_section: string | null
          stem_description: string | null
          stem_form: string | null
          stem_leaf_scar_shape: string | null
          stem_lenticels: string | null
          stem_pith: string | null
          stem_surface: string | null
          synonyms: string[] | null
          tags: Json | null
          texture: string | null
          usda_zones: Json | null
          uses: string | null
          width_max: number | null
          width_min: number | null
          wildlife_value: string | null
        }
        Relationships: []
      }
      plant_full_data: {
        Row: {
          attracts: Json | null
          available_space_to_plant: Json | null
          bark_attachment: Json | null
          bark_color: Json | null
          bark_description: string | null
          bark_plate_shape: Json | null
          common_names: string[] | null
          cultivars: Json | null
          description: string | null
          design_feature: Json | null
          distribution: string | null
          edibility: string | null
          family: string | null
          fire_risk: string | null
          flower_bloom_time: Json | null
          flower_colors: Json | null
          flower_description: string | null
          flower_inflorescence: Json | null
          flower_petals: Json | null
          flower_shape: Json | null
          flower_size: string | null
          flower_value_to_gardener: Json | null
          fruit_color: Json | null
          fruit_description: string | null
          fruit_display_harvest_time: Json | null
          fruit_length: string | null
          fruit_type: Json | null
          fruit_value_to_gardener: Json | null
          fruit_width: string | null
          garden_spaces: string | null
          genus: string | null
          growth_rate: string | null
          height_max: number | null
          height_min: number | null
          id: number | null
          images: Json | null
          landscape_location: Json | null
          landscape_theme: Json | null
          leaf_arrangement: Json | null
          leaf_characteristics: Json | null
          leaf_color: Json | null
          leaf_description: string | null
          leaf_fall_color: Json | null
          leaf_feel: Json | null
          leaf_hairs_present: string | null
          leaf_length: string | null
          leaf_margin: Json | null
          leaf_shape: Json | null
          leaf_type: Json | null
          leaf_value_to_gardener: Json | null
          leaf_width: string | null
          life_cycle: Json | null
          light_requirements: Json | null
          maintenance: Json | null
          nc_regions: Json | null
          origin: string | null
          phonetic_spelling: string | null
          plant_habit: Json | null
          plant_types: Json | null
          poison_dermatitis: string | null
          poison_parts: Json | null
          poison_severity: string | null
          poison_symptoms: string | null
          poison_toxic_principle: string | null
          problems: Json | null
          profile_video: string | null
          propagation: Json | null
          resistance_to_challenges: Json | null
          scientific_name: string | null
          slug: string | null
          soil_drainage: Json | null
          soil_ph: Json | null
          soil_texture: Json | null
          sound_file: string | null
          species: string | null
          stem_aromatic: string | null
          stem_bud_scale: string | null
          stem_bud_terminal: string | null
          stem_buds: string | null
          stem_color: Json | null
          stem_cross_section: string | null
          stem_description: string | null
          stem_form: string | null
          stem_leaf_scar_shape: string | null
          stem_lenticels: string | null
          stem_pith: string | null
          stem_surface: string | null
          synonyms: string[] | null
          tags: Json | null
          texture: string | null
          usda_zones: Json | null
          uses: string | null
          width_max: number | null
          width_min: number | null
          wildlife_value: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      binary_quantize:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      get_sorted_plants:
        | {
            Args: {
              p_limit: number
              p_offset: number
              p_sort_field: string
              p_sort_direction: string
              p_query: string
              p_filters: string
            }
            Returns: {
              slug: string
              description: string
              scientificname: string
              commonname: string
              tag: string
              img: string
              alttext: string
              caption: string
              attribution: string
            }[]
          }
        | {
            Args: {
              query_embedding: string
              match_threshold: number
              match_count: number
            }
            Returns: {
              id: number
              scientific_name: string
              common_names: string[]
              description: string
              light_requirements: string
              maintenance: string[]
              poison_severity: string
              similarity: number
            }[]
          }
      halfvec_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      match_cached_responses: {
        Args: {
          query_embedding: string
          match_threshold: number
          match_count: number
        }
        Returns: {
          response: string
          context: string
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
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
