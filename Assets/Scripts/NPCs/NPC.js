//#pragma strict

public class NPC extends Destructable
{
	//STATES
	public var my_state : NPC_state = NPC_state.idle;
	private var saved_state : NPC_state = NPC_state.idle;
	private var target_rotation : Quaternion;

	//STATISTICS
	public var damage : int = 10;
	private var speed : int = 2;
	private var reach : float = 3.0f;
	
	//RAYCAST
	private var width : float;
	private var length : float;
	private var distance : float = 1.0f;

	//COOLDOWN THRESHOLDS
	protected var search_cooldown : float = 2.0;
	protected var attack_cooldown : float = 1.0;
	private var follow_cooldown : float = 3.0;
	private var avoid_cooldown : float = 0.25f;

	//TIMERS
	protected var search_timer : float = 0.0;
	private var follow_timer : float = 0.0;
	protected var attack_timer : float = 0.0;
	private var avoid_timer : float = 0.0f;
	
	//CURRENTLY FOCUSED GAMEOBJECT
	public var target : GameObject = null;

	//SPAWNING TOWER
	protected var homeTower : GameObject = null;

	//CONVERSION
	public var conversionScript : MonoScript;
	
	//SAVED CHILDREN
	private var enemy_detector : Component;
	
	function Start()
	{
		max_health = 100;
		health = 100;
		enemy_detector = gameObject.GetComponentInChildren(Detect_Enemies);
		width = gameObject.GetComponent(Collider).bounds.size.x / 2;
		length = (gameObject.GetComponent(Collider).bounds.size.z / 2) + 1.0;
		target_rotation = gameObject.transform.rotation;
	}

	function FixedUpdate()
	{
	}
	
	function Update () 
	{
		transform.rotation = Quaternion.Slerp(transform.rotation, target_rotation, 4 * Time.deltaTime);
		//STATE SPECIFIC BEHAVIORS
		if(my_state == NPC_state.attacking)
		{
			Attack_State();
		}
		else if(my_state == NPC_state.moving)
		{
			Move_State();
			follow_timer += Time.deltaTime;
		}
		else if(my_state == NPC_state.hunting)
		{
			Hunt_State();
		}
		else if (my_state == NPC_state.idle)
		{
			search_timer += Time.deltaTime;
		}
		else if (my_state == NPC_state.avoiding)
		{
			Avoid_State();
		}
		Idle_State();
		attack_timer += Time.deltaTime;
	}

	//What to always do
	function Idle_State()
	{
		if ((my_state == NPC_state.hunting || my_state == NPC_state.idle) && search_timer > search_cooldown)
		{
			search_timer = 0.0f;
			var newTarget : GameObject;
			newTarget = homeTower.GetComponent(Tower).findSingleEnemy();
			if(newTarget != null)
			{
				target = newTarget;
				Change_State(NPC_state.moving);
			}
			else
			{
				Change_State(NPC_state.hunting);
			}
		}
	}
	
	//What to do if the current state is attacking
	function Attack_State()
	{
		if (target == null)
		{
			Change_State(NPC_state.idle);
		}
		else if (Vector3.Distance(transform.position, target.transform.position) < reach)
		{
			if(attack_timer >= attack_cooldown)
			{
				attack_timer = 0.0f;
				GetComponent.<Animation>().Stop();
				target_rotation = Quaternion.LookRotation(target.transform.position - Vector3(gameObject.transform.position.x, 0, gameObject.transform.position.z));
				//gameObject.transform.LookAt(Vector3(target.transform.position.x, gameObject.transform.position.y, target.transform.position.z));
				GetComponent.<Animation>().Play("BigAttack");
				doDamage();
			}
		}
		else
		{
			Change_State(NPC_state.moving);
		}
	}
	
	//What to do if the current state is moving
	function Move_State()
	{
		follow_timer += Time.deltaTime;
		if (target != null)
		{
			if (Vector3.Distance(transform.position, target.transform.position) < 1)
			{
				follow_timer = 0.0f;
				Change_State(NPC_state.attacking);
			}
			else if (Detect_Collision())
			{
				Change_State(NPC_state.avoiding);
			}
			else
			{
				if (follow_timer < follow_cooldown)
				{
					GetComponent.<Animation>().Play("run");
					target_rotation = Quaternion.LookRotation(target.transform.position - Vector3(gameObject.transform.position.x, 0, gameObject.transform.position.z));					//gameObject.transform.LookAt(Vector3(target.transform.position.x, gameObject.transform.position.y, target.transform.position.z));
					//var rb : Rigidbody = GetComponent.<Rigidbody>();
					//rb.AddForce(transform.forward * 1.0);
					transform.position = Vector3.MoveTowards(transform.position, Vector3(target.transform.position.x, transform.position.y, target.transform.position.z), speed * Time.deltaTime);
				}
				else
				{
					follow_timer = 0.0f;
					loseTarget();
				}
			}
		}
		else
		{
			follow_timer = 0.0f;
			Change_State(NPC_state.idle);
		}
	}
	
	//What to do if the current state is hunting
	function Hunt_State()
	{
		search_timer += Time.deltaTime;
		if (target == null)
		{
			target = Functions.Closest_Tag("End", gameObject.transform.position, 100.0f);
		}
		else if (Detect_Collision())
		{
			Change_State(NPC_state.avoiding);
		}
		else if (Vector3.Distance(transform.position, target.transform.position) < 1)
		{
			target = target.GetComponent("Waypoint").getPrevious();
			if (target == null)
			{
				Change_State(NPC_state.idle);
			}
		}
		else
		{
			GetComponent.<Animation>().Play("run");
			target_rotation = Quaternion.LookRotation(target.transform.position - Vector3(gameObject.transform.position.x, 0, gameObject.transform.position.z));
			//gameObject.transform.LookAt(Vector3(target.transform.position.x, gameObject.transform.position.y, target.transform.position.z));
			//var rb : Rigidbody = gameObject.GetComponent.<Rigidbody>();
			//if(rb.velocity.magnitude < 20.0f)
			//{
				//rb.AddForce(gameObject.transform.forward * 15.0);
			//}
			transform.position = Vector3.MoveTowards(transform.position, Vector3(target.transform.position.x, transform.position.y, target.transform.position.z), speed * Time.deltaTime);
		}
	}
	
	function Avoid_State()
	{
		avoid_timer += Time.deltaTime;
		if (avoid_timer >= avoid_cooldown)
		{
			avoid_timer = 0.0f;
			Change_State(saved_state);
		}
		else
		{
			GetComponent.<Animation>().Play("run");
			//var rb : Rigidbody = gameObject.GetComponent.<Rigidbody>();
			//if(rb.velocity.magnitude < 20.0f)
			//{
				//rb.AddForce(gameObject.transform.forward * 15.0);
			//}
			transform.position += transform.forward * Time.deltaTime * speed;
			//transform.position = Vector3.MoveTowards(gameObject.transform.position, gameObject.transform.position.forward + gameObject.transform.position, speed * Time.deltaTime);
		}
	}
	
	//To switch states this function must be gone through
	function Change_State(new_state : NPC_state)
	{
		switch (new_state)
		{
			case NPC_state.idle:
				my_state = NPC_state.idle;
				enemy_detector.SendMessage("Locate_Enemy", true);
				break;
			case NPC_state.moving:
				my_state = NPC_state.moving;
				enemy_detector.SendMessage("Locate_Enemy", true);
				break;
			case NPC_state.attacking:
				my_state = NPC_state.attacking;
				enemy_detector.SendMessage("Locate_Enemy", false);
				break;
			case NPC_state.hunting:
				my_state = NPC_state.hunting;
				enemy_detector.SendMessage("Locate_Enemy", true);
				break;
			case NPC_state.avoiding:
				saved_state = my_state;
				my_state = NPC_state.avoiding;
				enemy_detector.SendMessage("Locate_Enemy", true);
				break;
		}
	}
	
	function Detect_Collision() : boolean
	{
		if (Front_Ray())
		{
			var right_distance : float = Vector3.Distance((gameObject.transform.position + gameObject.transform.forward + gameObject.transform.right), target.transform.position);
			var left_distance : float = Vector3.Distance((gameObject.transform.position + gameObject.transform.forward - gameObject.transform.right), target.transform.position);
			if (right_distance < left_distance)
			{
				if(!Right_Ray())
				{
					Debug.Log("I'll go right!");
					target_rotation = Quaternion.LookRotation(gameObject.transform.forward + gameObject.transform.right);
					//gameObject.transform.LookAt(gameObject.transform.position + gameObject.transform.forward + gameObject.transform.right);
				}
				else if (!Left_Ray())
				{
					Debug.Log("I'll go left!");
					target_rotation = Quaternion.LookRotation(gameObject.transform.forward - gameObject.transform.right);
					//gameObject.transform.LookAt(gameObject.transform.position + gameObject.transform.forward - gameObject.transform.right);
				}
				else
				{
					Debug.Log("I'll turn around");
					target_rotation = Quaternion.LookRotation(-gameObject.transform.forward);
					//gameObject.transform.LookAt(gameObject.transform.position - gameObject.transform.forward);
				}
			}
			else
			{
				if (!Left_Ray())
				{
					Debug.Log("I'll go left!");
					target_rotation = Quaternion.LookRotation(gameObject.transform.forward - gameObject.transform.right);
					//gameObject.transform.LookAt(gameObject.transform.position + gameObject.transform.forward - gameObject.transform.right);
				}
				else if(!Right_Ray())
				{
					Debug.Log("I'll go right!");
					target_rotation = Quaternion.LookRotation(gameObject.transform.forward + gameObject.transform.right);
					//gameObject.transform.LookAt(gameObject.transform.position + gameObject.transform.forward + gameObject.transform.right);
				}
				else
				{
					Debug.Log("I'll turn around");
					target_rotation = Quaternion.LookRotation(-gameObject.transform.forward);
					//gameObject.transform.LookAt(gameObject.transform.position - gameObject.transform.forward);
				}
			}
			return true;
		}
		return false;
	}
	
	function Right_Ray() : boolean
	{
		var hit: RaycastHit;
		//return Physics.Raycast(transform.position + Vector3(0, .5, 0), Vector3(-1,0,-1), 5);
		return Physics.SphereCast (transform.position + Vector3(0, .5, 0), width, transform.forward + transform.right, hit, distance);
	}
	
	function Left_Ray() : boolean
	{
		var hit: RaycastHit;
		//return Physics.Raycast(transform.position + Vector3(0, .5, 0), Vector3(-1,0,1), 5);
		return Physics.SphereCast (transform.position + Vector3(0, .5, 0), width, transform.forward - transform.right, hit, distance);
	}
	
	function Front_Ray() : boolean
	{
		var hit: RaycastHit;
		var front_color : Color = Color.green;
		
		Debug.DrawRay (transform.position + Vector3(0, .5, 0) + transform.forward, Vector3(-1,0,1), Color.blue);
		if(Physics.Raycast(transform.position + Vector3(0, .5, 0), transform.forward, length))
		{
			front_color = Color.red;
		}
		Debug.DrawRay (transform.position + Vector3(0, .5, 0) + transform.forward, transform.forward, front_color);
		front_color = Color.green;
		if(Physics.Raycast(transform.position + Vector3(0, .5, 0), Vector3(-1,0,-1), length))
		{
			front_color = Color.red;
		}
		Debug.DrawRay (transform.position + Vector3(0, .5, 0) + transform.forward, Vector3(-1,0,-1), front_color);
		front_color = Color.green;
		if(Physics.Raycast(transform.position + Vector3(0, .5, 0), Vector3(-1,0,1), length))
		{
			front_color = Color.red;
		}
		Debug.DrawRay (transform.position + Vector3(0, .5, 0) + transform.forward, Vector3(-1,0,1), front_color);
		//return Physics.SphereCast (transform.position + Vector3(0, .5, 0), width, transform.forward, hit, length);
		//for (var object_hit : RaycastHit in Physics.SphereCastAll (transform.position + Vector3(0, .5, 0), width, transform.forward, distance))
		for (var object_hit : RaycastHit in Physics.SphereCastAll (transform.position + Vector3(0, .5, 0), width, Vector3.Scale((target.transform.position - transform.position), Vector3(1, 0, 1)), distance))
		{
			if (object_hit.transform.gameObject.tag == "Tower" || object_hit.transform.gameObject.tag == "Terrain")
			{
				Debug.Log(object_hit.transform.gameObject.tag);
				return true;
			}
		}
		return false;
	}
	
	function doDamage()
	{
		var dmgPacket : List.<Object> = new List.<Object>();
		dmgPacket.Add(damage);
		dmgPacket.Add(homeTower);
		target.GetComponent("AI").SendMessage("takeDamage", dmgPacket);
	}

	function linkTower(myTower : GameObject)
	{
		homeTower = myTower;
		for (var child : Transform in gameObject.transform) 
		{
			if(child.name == "Flame")
			{
				child.gameObject.GetComponent("FlameAttack").linkTower(homeTower);
			}
		}
	}

	function Attack (the_target : GameObject)
	{
		target = the_target;
		Change_State(NPC_state.attacking);
	}

	function loseTarget()
	{
		target = null;
		Change_State(NPC_state.idle);
	}

	//OVERWRITTEN FROM DESTRUCTABLE
	function takeDamage(dmg_packet : List.<Object>)
	{
		super.takeDamage(dmg_packet);
		if(health <= 0)
		{
			homeTower.GetComponent(Tower).Minion_Died(gameObject);
			Destroy(gameObject);
		}
	}

	function setDamage(amount : int)
	{
		damage = amount;
	}

	function getDamage() : int
	{
		return damage;
	}

	function mend(amount : int) : boolean
	{
		health += max_health / amount;
		if(health >= max_health)
		{
			health = max_health;
			return false;
		}
		return true;
	}

	function getStats() : String
	{
		return "MYNAME" + "\nLevel MYLEVEL: " + "\nHealth: " + health + "/" + max_health + "\nKills MYKILLS: " + "\nTotal Damage: MYDAMAGE" + "\n";
	}
}